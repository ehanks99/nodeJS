const { Pool } = require("pg");
const async = require('async');
const connectionString2 = process.env.DATABASE_URL;
const pool2 = new Pool({connectionString: connectionString2});
let res;
let count = 0;
let numRows = 20;


function collectAllMovieData(request, response) {
    console.log("Getting all movie information.");

    // For some reason, the response turned null at just the point I needed it. I couldn't fix it, so I'm setting it as a global variable
    res = response;

    // start count off at zero
    count = 0;

   /*
    async.waterfall([
        function dothis(callback) {
            console.log("inside the first function");
            selectAllMovieDataQuery(grabItemsForEachMovie);
            callback(null);
        },
        function dothat(callback) {
            
            console.log("inside second function");
            callback(null);
        }
        ], function (error) {
            console.log("finished");
        })*/
        
    selectAllMovieDataQuery(/*callback - movie names have now been grabbed*/ grabItemsForEachMovie);

    //response.json({result: 2});
}

function grabItemsForEachMovie(error, resultRows) {
    console.log("inside the \"grabItemsForEachMovie\" functions");
    var movieArray = { movies: resultRows };
    console.log("Movie info has been grabbed - now working on grabbing the directors, actors and genres for each movie.");


    if (error) {
        console.log("ERROR: " + error);
        response.status(500).json({success:false, data:error});
    }
    else {
        // for each movie, add the respective actors, directors, and genres to that movie
        for (var i in resultRows) {
            //console.log("Grabbing directors, actors, and genres for movie: ", movieArray.movies[i].movie_name);
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
    console.log("inside the \"selectAllMovieDataQuery\" functions");
    var sql = "SELECT movie.movie_id, movie.movie_name, movie.movie_rating, movie.picture_filepath, movie.movie_summary FROM movie;";

    pool2.query(sql, function(error, result) {
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

// This runSqlQuery function is made specifically to update an existing array
// with the data found from the query
function runSqlQuery(sql, params, callback, index, movieArray) {
    pool2.query(sql, params, function(error, result) {
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
    runSqlQuery(sql, params, addDirectorsToMovie, index, movieArray);
}

function addDirectorsToMovie(error, index, movieArray, directorArray) {
    
    if (error) {
        response.status(500).json({success:false, data:error});
    }
    else {
        movieArray.movies[index].directors = directorArray;
        //console.log(movieArray.movies[index].directors);
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
    runSqlQuery(sql, params, addActorsToMovie, index, movieArray);
}

function addActorsToMovie(error, index, movieArray, actorArray) {
    
    if (error) {
        response.status(500).json({success:false, data:error});
    }
    else {
        movieArray.movies[index].actors = actorArray;
        //console.log(movieArray.movies[index].actors);
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
    runSqlQuery(sql, params, addGenresToMovie, index, movieArray);
}

function addGenresToMovie(error, index, movieArray, genreArray) {
    //console.log("incrementing count - originally ", count);
    // increment our row count
    count++;
    
    if (error) {
        response.status(500).json({success:false, data:error});
    }
    else {
        movieArray.movies[index].genres = genreArray;
        //console.log(movieArray.movies[index].genres);
    }


    if (count == numRows) {
        //console.log(movieArray.movies[0].directors);
        // From what I can tell, this is the point where all the data should now be collected, correctly, in the movieArray

        // to be sure that all the other functions have finished, have a small timeout thingy for 250 milliseconds
        setTimeout(function () {
            try {
                //response.render("/project02/mainPage", { movieArray: movieArray});
                console.log("movie information found, returning to mainPage");
                res.json({"movieArray": movieArray}); 
            }
            catch (error) {
                console.log("ERROR: " + error);
                response.status(500).json({success:false, data:error});
            }
        }, 250);
    }
}

module.exports = {
    collectAllMovieData: collectAllMovieData
}