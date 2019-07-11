var express = require("express");
var url = require("url");
//var app = express();
let router = express.Router();
let parser = require("body-parser");

router.use(parser.urlencoded({extended: false}));


const { Pool } = require("pg");
const connectionString = process.env.DATABASE_URL || "postgres://familyhistoryuser:elijah@localhost:5432/familyhistory";
const pool = new Pool({connectionString: connectionString});

router.get("/team-activity10/person/:id", getPerson);

function getPerson(request, response) {
    console.log("Getting person information.");

    var id = request.params.id;
    console.log("Retrieving person with id: " + id);

    getPersonFromDB(id, function(error, result) {
        console.log("Back from the getPersonFromDB function with result:", result);

        if (error || result == null || result.length != 1) {
            response.status(500).json({success:false, data:error});
        }
        else {
            response.json(result[0]);
        }
    });
    
    //var result = { id: 238, first: "John", last: "Smith", birthdate: "1950-02-05" };
    //response.json(result);
}

function getPersonFromDB(id, callback) {
    console.log("getPersonFromDB called with id:", id);

    var sql = "SELECT id, first, last, birthdate FROM person WHERE id = $1::int";
    var params = [id];

    pool.query(sql, params, function(error, result) {
        if (error) {
            console.log("An error with the DB occurred");
            console.log(error);
            callback(error, null);
        }

        console.log("Found DB result: " + JSON.stringify(result.rows));

        callback(null, result.rows);
    })
}

module.exports = router;