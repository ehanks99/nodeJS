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

function insertNewRating(request, response) {
    let sql = "INSERT INTO rating (rating_id, rating_name) " +
              "  VALUES (nextval('rating_s1'), $1)";
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

function updateRating(request, response) {
    let sql = "UPDATE rating " +
              "SET rating_name = $1 " +
              "WHERE rating_name = $2 ";
    let params = [request.body.newValue, request.body.oldValue];
    
    // send the sql query and params to be executed
    insertDataIntoDB(sql, params, response);
}

function deleteDirector(request, response) {
    let sql = "DELETE FROM director WHERE director_name = $1";
    let params = [request.body.value];

    insertDataIntoDB(sql, params, response);
}

function deleteActor(request, response) {
    let sql = "DELETE FROM starring_actor WHERE actor_name = $1";
    let params = [request.body.value];

    insertDataIntoDB(sql, params, response);
}

function deleteGenre(request, response) {
    let sql = "DELETE FROM genre WHERE genre_type = $1";
    let params = [request.body.value];

    insertDataIntoDB(sql, params, response);
}

function deleteRating(request, response) {
    let sql = "DELETE FROM rating WHERE rating_name = $1";
    let params = [request.body.value];

    insertDataIntoDB(sql, params, response);
}

function runQuery(sql, params, callback) {
    pool.query(sql, params, function(error, result) {
        if (error) {
            console.log("An error with the DB occurred");
            console.log(error);

            callback(error, result);
        }
        
        callback(null, result);
    })
}

function insertNewMovie(request, response) {
    console.log("inserting a movie");
    let movieName = request.body.movieName;
    let movieSummary = request.body.summary;
    let movieRating = request.body.rated;
    let directors = request.body["director[]"];
    let actors = request.body["actor[]"];
    let genres = request.body["genre[]"];
    
    // first, check if the movie is already in the DB
    let sql = "SELECT movie_id FROM movie WHERE movie_name = $1";
    let params = [movieName];

    runQuery(sql, params, function(error, result) {
        if (error) {
            response.json({success: false, error: error});
        }
        else if (result.rows.length > 0) {
            response.json({success: false, error: "There's already a movie by that name in the database."});
        }
        else {
            sql = "INSERT INTO movie (movie_id, movie_name, movie_rating, picture_filepath, movie_summary) " +
                  "VALUES (nextval('movie_s1'), $1, $2, '', $3)";
            params = [movieName, movieRating, movieSummary];

            runQuery(sql, params, function(err, res) {
                if (err) console.log("there was an error inserting the movie name");
                else console.log("there was no error inserting the movie name");
                // now, push all of our actors and directors into the database 
                // and connect them to the movieName (if they're already there, it shouldn't insert them)
                if (Array.isArray(directors)) {
                    directors.forEach(function(director) {
                        insertDirector(movieName, director);
                    });
                }
                else { 
                    insertDirector(movieName, directors);
                }

                // insert actors
                if (Array.isArray(actors)) {
                    actors.forEach(function(actor) {
                        insertActor(movieName, actor);
                    });
                }
                else { 
                    insertActor(movieName, actors);
                }
                
                // insert genres
                if (Array.isArray(genres)) {
                    genres.forEach(function(genre) {
                        insertGenre(movieName, genre);
                    });
                }
                else { 
                    insertGenre(movieName, genres);
                }
            });
        }
    });

    response.json({success: true});
}

function insertDirector(movieName, director) {
    // first make sure that the director isn't in the table before we try inserting it
    let sql = "SELECT director_id FROM director WHERE director_name = $1";
    let params = [director];

    runQuery(sql, params, function(error, result) {
        if (result && result.rows.length == 0) {
            sql = "INSERT INTO director (director_id, director_name) " +
                    "VALUES (nextval('director_s1'), $1)";
            params = [director];
            runQuery(sql, params, function(er, re) {
                if (er) console.log("ERROR inserting new dirctor"); 
                else console.log("inserted new dirctor");
            });
        }
    
        sql = "INSERT INTO movie_to_director (movie_director_id, movie_id, director_id) " +
            "VALUES (nextval('movie_to_director_s1'), (SELECT movie_id FROM movie WHERE movie_name = $1), " +
            "(SELECT director_id FROM director WHERE director_name = $2))";
        params = [movieName, director];

        runQuery(sql, params, function(e, r) {
            if (e) console.log("ERROR inserting a movie_to_director row"); 
            else console.log("inserted a movie_to_director row"); 
        });
    });
}

function insertActor(movieName, actor) {
    // first make sure that the director isn't in the table before we try inserting it
    let sql = "SELECT actor_id FROM starring_actor WHERE actor_name = $1";
    let params = [actor];

    runQuery(sql, params, function(error, result) {
        if (result && result.rows.length == 0) {
            sql = "INSERT INTO starring_actor (actor_id, actor_name) " +
                    "VALUES (nextval('starring_actor_s1'), $1)";
            params = [actor];

            runQuery(sql, params, function(er, re) {
                if (er) console.log("ERROR inserting new actor"); 
                else console.log("inserted new actor");
            });
        }

        sql = "INSERT INTO movie_to_starring_actor (movie_actor_id, movie_id, actor_id) " +
                "VALUES (nextval('movie_to_starring_actor_s1'), (SELECT movie_id FROM movie WHERE movie_name = $1), " +
                "(SELECT actor_id FROM starring_actor WHERE actor_name = $2))";
        params = [movieName, actor];

        runQuery(sql, params, function(e, r) { 
            if (e) console.log("ERROR inserting a movie_to_starring_actor row"); 
            else console.log("inserted a movie_to_starring_actor row"); 
        });
    });
}

function insertGenre(movieName, genre) {
    // genres are already in the genre table, just set the many to many relationship up
    let sql = "INSERT INTO movie_to_genre (movie_genre_id, movie_id, genre_id) " +
            "VALUES (nextval('movie_to_genre_s1'), (SELECT movie_id FROM movie WHERE movie_name = $1), " +
            "(SELECT genre_id FROM genre WHERE genre_type = $2))";
    let params = [movieName, genre];

    runQuery(sql, params, function(e, r) { 
        if (e) console.log("ERROR inserting a movie_to_genre row"); 
        else console.log("inserted a movie_to_genre row"); });
}

function deleteMovie(request, response) {
    let movieId = request.body.movieId;

    // delete the movie to director relationships
    let sql = "DELETE FROM movie_to_director WHERE movie_id = $1;";
    let params = [movieId];

    // chain multiple deletes together
    runQuery(sql, params, function(error, result) {
        // delete the movie to starring actor relationships
        sql = "DELETE FROM movie_to_starring_actor WHERE movie_id = $1";
        // the params variable doesn't need to be changed

        runQuery(sql, params, function(erro, resul) {
            // delete the movie to genre relationships
            sql = "DELETE FROM movie_to_genre WHERE movie_id = $1";

            runQuery(sql, params, function(err, resu) {

                // lastly, delete the movie itself
                sql = "DELETE FROM movie WHERE movie_id = $1";

                runQuery(sql, params, function(er, res) {
                    if (er) response.json({success:false, error: er});
                    else response.json({success:true});
                });
            });
        });
    });
}

module.exports = {
    insertNewDirector: insertNewDirector,
    insertNewActor: insertNewActor,
    insertNewGenre: insertNewGenre,
    insertNewRating: insertNewRating,
    insertNewMovie: insertNewMovie,
    updateDirector: updateDirector,
    updateActor: updateActor,
    updateGenre: updateGenre,
    updateRating: updateRating,
    deleteDirector: deleteDirector,
    deleteActor: deleteActor,
    deleteGenre: deleteGenre,
    deleteRating: deleteRating,
    deleteMovie: deleteMovie
}