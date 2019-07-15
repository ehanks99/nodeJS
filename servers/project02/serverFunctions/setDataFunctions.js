let express = require("express");
let parser = require("body-parser");
const { Pool } = require("pg");

let router = express.Router();
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({connectionString: connectionString});

router.use(parser.urlencoded({extended: false}));


function insertDataIntoDB(sql, params, response) {
    pool.query(sql, params, function(error, result) {
        // message indicating success or failure
        let message = {success:true};

        if (error) {
            console.log("An error with the DB occurred");
            console.log(error);

            message = {success:false, error:error.detail};
        }
        
        response.json(message);
    })
}

function insertNewDirector(request, response) {
    //let director = request.body.name;
    //console.log("got passed the director: " + director);

    let sql = "INSERT INTO director (director_id, director_name) " +
              "  VALUES (nextval('director_s1'), $1)";
    let params = [request.body.name];
    
    // send the sql query and params to be executed
    insertDataIntoDB(sql, params, response);
}

function insertNewActor(request, response) {
    let sql = "INSERT INTO starring_actor (actor_id, actor_name) " +
              "  VALUES (nextval('starring_actor_s1'), $1)";
    let params = [request.body.name];
    
    // send the sql query and params to be executed
    insertDataIntoDB(sql, params, response);
}

function insertNewGenre(request, response) {
    let sql = "INSERT INTO genre (genre_id, genre_type) " +
              "  VALUES (nextval('genre_s1'), $1)";
    let params = [request.body.name];
    
    // send the sql query and params to be executed
    insertDataIntoDB(sql, params, response);
}

function updateDirector(request, response) {
    let sql = "UPDATE director " +
              "SET director_name = $1 " +
              "WHERE director_name = $2 ";
    let params = [request.body.newValue, request.body.oldValue];
    
    // send the sql query and params to be executed
    insertDataIntoDB(sql, params, response);
}

function updateActor(request, response) {
    let sql = "UPDATE starring_actor " +
              "SET actor_name = $1 " +
              "WHERE actor_name = $2 ";
    let params = [request.body.newValue, request.body.oldValue];
    
    // send the sql query and params to be executed
    insertDataIntoDB(sql, params, response);
}

function updateGenre(request, response) {
    let sql = "UPDATE genre " +
              "SET genre_type = $1 " +
              "WHERE genre_type = $2 ";
    let params = [request.body.newValue, request.body.oldValue];
    
    // send the sql query and params to be executed
    insertDataIntoDB(sql, params, response);
}

function insertNewMovie(request, response) {
    console.log("inserting new movie");
    /*
    let sql;
    let params;
    
    // send the sql query and params to be executed
    insertDataIntoDB(sql, params, response);
    */
}

module.exports = {
    insertNewDirector: insertNewDirector,
    insertNewActor: insertNewActor,
    insertNewGenre: insertNewGenre,
    insertNewMovie: insertNewMovie,
    updateDirector: updateDirector,
    updateActor: updateActor,
    updateGenre: updateGenre
}