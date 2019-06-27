var express = require("express");
var url = require("url");
var app = express();

app.set("port", (process.env.PORT || 5000));
app.use(express.static("/public"));
app.set("views", "views");
app.set("view engine", "ejs");


/***********************************************************
 * teamActivity09 stuff 
 **********************************************************/
app.get("/team-activity09", function(request, response) {
    response.render("pages/team-activity09/form");
    console.log("got a request for /team-activity09");
})

app.get("/team-activity09/math", function(request, response) { 
    let result = calculate(request, response); 
    response.render("pages/team-activity09/math", {result: result}); 
    console.log("got a request for pages/team-activity09/math");
});

app.get("/team-activity09/math_service", function(request, response) { 
    let result = calculate(request, response); 
    response.json({"result": result}); 
    console.log("got a request for pages/team-activity09/math_service");
});

function calculate(req, res) {
    let query = url.parse(req.url, true).query;
        
    let lhs = parseFloat(query.lhs);
    let operation = query.operation;
    let rhs = parseFloat(query.rhs);
    let result = 0;

    if (operation == '+') {
        result = lhs + rhs;
    } else if (operation == '-') {
        result = lhs - rhs;
    } else if (operation == '*') {
        result = lhs * rhs;
    } else if (operation == '/') {
        result = lhs / rhs;
    } else {
        result = 0;
    }

    console.log("Result " + result);
    return result;
    //res.render('pages/team-activity09/math', {result: result});
}

/***********************************************************
 * prove09 stuff 
 **********************************************************/
app.get("/prove09/getRate", function(request, response) {
    console.log("Received a request for /prove09/getRate");
    var query = url.parse(request.url, true).query;
    var params = { weight: Number(query.weight), type: query.radioButtons };

    response.render("pages/prove09/getRate", params);
})


/***********************************************************
 * teamActivity10 stuff 
 **********************************************************/
const { Pool } = require("pg");
const connectionString = process.env.DATABASE_URL || "postgres://familyhistoryuser:elijah@localhost:5432/familyhistory";
const pool = new Pool({connectionString: connectionString});

app.get("/person/:id", getPerson);

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

/***********************************************************
 * set the server listening 
 **********************************************************/ 
app.listen(app.get("port"), function() {
	console.log("The server is up and listening on port 5000");
});