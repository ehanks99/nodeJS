const { Pool } = require("pg");
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({connectionString: connectionString});
let res;
let req;
let count = 0;
let numRows = 20;


let url = require("url");

function collectAllMovieData(request, response) {
    // I'm planning to modify this entire function (plus the chain-linked functions) to make it cleaner

    console.log("Getting all movie information.");

    // If we still have the data saved in our session variable, we'll just return that
    if (request.session.dataList && request.session.dataList != "") {
        console.log("\nThe movie list was saved in our session - grabbing that\n");
        response.json({success:true, "movieArray": req.session.dataList}); 
        return;
    }

    // Otherwise, we've got to look it up in the database

    // For some reason, the response turned null at just the point I needed it. I couldn't fix it, so I'm setting it as a global variable
    res = response;
    req = request;

    // start count off at zero
    count = 0;

    selectAllMovieDataQuery(grabItemsForEachMovie);
}

function grabItemsForEachMovie(error, resultRows) {
    var movieArray = { movies: resultRows };
    console.log("Movie info has been grabbed - now working on grabbing the directors, actors and genres for each movie.");


    if (error) {
        console.log("ERROR: " + error);
        res.status(500).json({success:false, data:error});
    }
    else {
        // for each movie, add the respective actors, directors, and genres to that movie
        for (var i in resultRows) {
            // directors
            queryDirectorsForGivenMovieName(i, movieArray, resultRows[i].movie_name);

            // actors
            queryActorsForGivenMovieName(i, movieArray, resultRows[i].movie_name);

            // genres
            queryGenresForGivenMovieName(i, movieArray, resultRows[i].movie_name);
        }
    }
}

function selectAllMovieDataQuery(callback) {
    var sql = "SELECT movie.movie_id, movie.movie_name, movie.movie_rating, movie.picture_filepath, movie.movie_summary FROM movie;";

    pool.query(sql, function(error, result) {
        if (error) {
            console.log("An error with the DB occurred");
            console.log("ERROR: " + error);
            callback(error, null);
        }
        
        // save how many movies there are in the database to a global variable
        numRows = result.rows.length;
        callback(null, result.rows);
    });
}

// This runSpecializedSqlQuery function is made specifically to update an existing array
// with the data found from the query
function runSpecializedSqlQuery(sql, params, callback, index, movieArray) {
    pool.query(sql, params, function(error, result) {
        if (error) {
            console.log("An error with the DB occurred");
            console.log("ERROR: " + error);
            callback(error, null);
        }
        
        callback(null, index, movieArray, result.rows);
    })
}

// functions to add directors to our movie list
function queryDirectorsForGivenMovieName(index, movieArray, movieName) {
    var sql = "SELECT director.director_name " +
              "FROM movie_to_director " +
              "  INNER JOIN movie ON movie_to_director.movie_id = movie.movie_id " +
              "  INNER JOIN director ON movie_to_director.director_id = director.director_id " +
              "WHERE movie.movie_name = $1";
    var params = [movieName];
    runSpecializedSqlQuery(sql, params, addDirectorsToMovie, index, movieArray);
}

function addDirectorsToMovie(error, index, movieArray, directorArray) {
    
    if (error) {
        response.status(500).json({success:false, data:error});
    }
    else {
        movieArray.movies[index].directors = directorArray;
    }
}

// functions to add actors to our movie list
function queryActorsForGivenMovieName(index, movieArray, movieName) {
    var sql = "SELECT starring_actor.actor_name " +
              "FROM movie_to_starring_actor " +
              "  INNER JOIN movie ON movie_to_starring_actor.movie_id = movie.movie_id " +
              "  INNER JOIN starring_actor ON movie_to_starring_actor.actor_id = starring_actor.actor_id " +
              "WHERE movie.movie_name = $1";
    var params = [movieName];
    runSpecializedSqlQuery(sql, params, addActorsToMovie, index, movieArray);
}

function addActorsToMovie(error, index, movieArray, actorArray) {
    
    if (error) {
        response.status(500).json({success:false, data:error});
    }
    else {
        movieArray.movies[index].actors = actorArray;
    }
}

// functions to add genres to our movie list
function queryGenresForGivenMovieName(index, movieArray, movieName) {
    var sql = "SELECT genre.genre_type " +
              "FROM movie_to_genre " +
              "  INNER JOIN movie ON movie_to_genre.movie_id = movie.movie_id " +
              "  INNER JOIN genre ON movie_to_genre.genre_id = genre.genre_id " +
              "WHERE movie.movie_name = $1";
    var params = [movieName];
    runSpecializedSqlQuery(sql, params, addGenresToMovie, index, movieArray);
}

function addGenresToMovie(error, index, movieArray, genreArray) {
    // increment our row count
    count++;
    
    if (error) {
        response.status(500).json({success:false, data:error});
    }
    else {
        movieArray.movies[index].genres = genreArray;
    }


    if (count == numRows) {
        // From what I can tell, this is the point where all the data should now be collected, correctly, in the movieArray

        // to be sure that all the other functions have finished, have a small timeout thingy for 250 milliseconds
        setTimeout(function () {
            try {
                console.log("movie information found, returning to mainPage");
                req.session.dataList = movieArray;
                res.json({success:true, "movieArray": movieArray}); 
            }
            catch (error) {
                console.log("ERROR: " + error);
                response.status(500).json({success:false, data:error});
            }
        }, 250);
    }
}

function runSqlQuery(sql, params, callback, response) {
    pool.query(sql, params, function(error, result) {
        if (error) {
            console.log("An error with the DB occurred");
            console.log("ERROR: " + error);
            callback(error, null, response);
        }
        
        callback(null, result.rows, response);
    });
}

function sendResultsBack(error, results, response) {
    if (error) {
        response.status(500).json({success:false, error:error});
    }
    else {
        response.json({success:true, results:results});
    }
}

function getDirectors(request, response) {
    let query = url.parse(request.url, true).query;

    // we should be given a movie name in the query string
    // we need to return the directors of the given movie
    let movieName = query.movie;
    var sql = "SELECT director.director_name " +
              "FROM movie_to_director " +
              "  INNER JOIN movie ON movie_to_director.movie_id = movie.movie_id " +
              "  INNER JOIN director ON movie_to_director.director_id = director.director_id " +
              "WHERE movie.movie_name = $1";
    var params = [movieName];

    // run the query and return the results
    runSqlQuery(sql, params, sendResultsBack, response);
}

function getAllDirectors(request, response) {
    // we need to return all the directors in the database
    var sql = "SELECT director.director_name AS data " +
              "FROM director";
    
    // run the query and return the results
    runSqlQuery(sql, null, sendResultsBack, response);
}

function getActors(request, response) {
    let query = url.parse(request.url, true).query;

    // we should be given a movie name in the query string
    // we need to return the actors of the given movie
    let movieName = query.movie;
    var sql = "SELECT starring_actor.actor_name " +
              "FROM movie_to_starring_actor " +
              "  INNER JOIN movie ON movie_to_starring_actor.movie_id = movie.movie_id " +
              "  INNER JOIN starring_actor ON movie_to_starring_actor.actor_id = starring_actor.actor_id " +
              "WHERE movie.movie_name = $1";
    var params = [movieName];

    // run the query and return the results
    runSqlQuery(sql, params, sendResultsBack, response);
}

function getAllActors(request, response) {
    // we need to return all the actors in the database
    var sql = "SELECT starring_actor.actor_name AS data " +
              "FROM starring_actor";
    
    // run the query and return the results
    runSqlQuery(sql, null, sendResultsBack, response);
}

function getGenres(request, response) {
    let query = url.parse(request.url, true).query;

    // we should be given a movie name in the query string
    // we need to return the genres of the given movie
    let movieName = query.movie;
    var sql = "SELECT genre.genre_type " +
              "FROM movie_to_genre " +
              "  INNER JOIN movie ON movie_to_genre.movie_id = movie.movie_id " +
              "  INNER JOIN genre ON movie_to_genre.genre_id = genre.genre_id " +
              "WHERE movie.movie_name = $1";
    var params = [movieName];

    // run the query and return the results
    runSqlQuery(sql, params, sendResultsBack, response);
}

function getAllGenres(request, response) {
    // we need to return all the genres in the database
    var sql = "SELECT genre.genre_type AS data " +
              "FROM genre";
    
    // run the query and return the results
    runSqlQuery(sql, null, sendResultsBack, response);
}

function getRatings(request, response) {
    let query = url.parse(request.url, true).query;

    // we should be given a movie name in the query string
    // we need to return the rating of the given movie
    let movieName = query.movie;
    var sql = "SELECT movie.movie_rating " +
              "FROM movie " +
              "WHERE movie.movie_name = $1";
    var params = [movieName];

    // run the query and return the results
    runSqlQuery(sql, params, sendResultsBack, response);
}

function getAllRatings(request, response) {
    // we need to return all the genres in the database
    var sql = "SELECT rating.rating_name AS data " +
              "FROM rating";
    
    // run the query and return the results
    runSqlQuery(sql, null, sendResultsBack, response);
}

function getMovies(request, response) {
    let query = url.parse(request.url, true).query;
    let sql;
    let params;

    // We could be sent an actor, director, or genre - depending on
    // what is sent to us, we need to query the data a little different
    if (query.director != null) {
        sql = "SELECT movie.movie_name " +
                  "FROM movie_to_director " +
                  "  INNER JOIN movie ON movie_to_director.movie_id = movie.movie_id " +
                  "  INNER JOIN director ON movie_to_director.director_id = director.director_id " +
                  "WHERE director.director_name = $1";
        params = [query.director];
    }
    else if (query.actor != null) {
        sql = "SELECT movie.movie_name " +
                  "FROM movie_to_starring_actor " +
                  "  INNER JOIN movie ON movie_to_starring_actor.movie_id = movie.movie_id " +
                  "  INNER JOIN starring_actor ON movie_to_starring_actor.actor_id = starring_actor.actor_id " +
                  "WHERE starring_actor.actor_name = $1";
        params = [query.actor];
    }
    else if (query.genre != null) {
        sql = "SELECT movie.movie_name " +
                  "FROM movie_to_genre " +
                  "  INNER JOIN movie ON movie_to_genre.movie_id = movie.movie_id " +
                  "  INNER JOIN genre ON movie_to_genre.genre_id = genre.genre_id " +
                  "WHERE genre.genre_type = $1";
        params = [query.genre];
    }
    else {
        // we weren't sent anything, so we can only return null
        console.log("we weren't given any search criteria for 'getMovies'");
        response.json({success:true, movies:null});
    }

    // run the query and return the results
    runSqlQuery(sql, params, sendResultsBack, response);
}

function getAllMovies(request, response) {
    // we need to return all the genres in the database
    var sql = "SELECT movie.movie_name " +
              "FROM movie";
    
    // run the query and return the results
    runSqlQuery(sql, null, sendResultsBack, response);
}

module.exports = {
    collectAllMovieData: collectAllMovieData,
    getDirectors: getDirectors,
    getAllDirectors: getAllDirectors,
    getActors: getActors,
    getAllActors: getAllActors,
    getGenres: getGenres,
    getAllGenres: getAllGenres,
    getRatings: getRatings,
    getAllRatings: getAllRatings,
    getMovies: getMovies,
    getAllMovies: getAllMovies
}