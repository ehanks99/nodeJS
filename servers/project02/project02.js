var express = require("express");
var url = require("url");
//var app = express();
let router = express.Router();
let parser = require("body-parser");
let getData = require("./serverFunctions/getDataFunctions.js");
let setData = require("./serverFunctions/setDataFunctions.js");
let signUp = require("./serverFunctions/signUpInFunctions.js");


// set up the session
let session = require('express-session');
router.use(session({
  secret: 'my-super-duper-secret! O.O',
  resave: false,
  saveUninitialized: true
}))

router.use(parser.urlencoded({extended: false}));

router.get("/project02", function(request, response) {
    response.render("pages/project02/mainPage");
});

router.get("/project02/mainPage", function(request, response) {
    response.render("pages/project02/mainPage");
});

router.get("/project02/login", function(request, response) {
    response.render("pages/project02/login");
});

router.get("/project02/signUp", function(request, response) {
    response.render("pages/project02/signUp");
});

router.get("/project02/edit-add/:page", function(request, response) {
    let page = request.params.page;
    
    if (page == "movie") {
        response.render("pages/project02/editAddMovie.ejs");
    }
    else {
        response.render("pages/project02/editAdd.ejs", {page: page});
    }
});

router.get("/project02/loggedIn", signUp.getLoginStatus);
router.get("/project02/logout", signUp.logout);
router.post("/project02/validate/login", signUp.validateLogin);
router.post("/project02/validate/signUp", signUp.signUp);
router.post("/project02/isUniqueUsername", signUp.isUniqueUsername);

router.get("/project02/getAllMovieData", getData.collectAllMovieData);

router.get("/project02/directors", getData.getDirectors);
router.get("/project02/alldirectors", getData.getAllDirectors);
router.post("/project02/director", emptyMovieSession, setData.insertNewDirector);
router.post("/project02/update/director", emptyMovieSession, setData.updateDirector);
router.post("/project02/delete/director", emptyMovieSession, setData.deleteDirector);

router.get("/project02/actors", getData.getActors);
router.get("/project02/allactors", getData.getAllActors);
router.post("/project02/actor", emptyMovieSession, setData.insertNewActor);
router.post("/project02/update/actor", emptyMovieSession, setData.updateActor);
router.post("/project02/delete/actor", emptyMovieSession, setData.deleteActor);

router.get("/project02/genres", getData.getGenres);
router.get("/project02/allgenres", getData.getAllGenres);
router.post("/project02/genre", emptyMovieSession, setData.insertNewGenre);
router.post("/project02/update/genre", emptyMovieSession, setData.updateGenre);
router.post("/project02/delete/genre", emptyMovieSession, setData.deleteGenre);

router.get("/project02/ratings", getData.getRatings);
router.get("/project02/allratings", getData.getAllRatings);
router.post("/project02/rating", emptyMovieSession, setData.insertNewRating);
router.post("/project02/update/rating", emptyMovieSession, setData.updateRating);
router.post("/project02/delete/rating", emptyMovieSession, setData.deleteRating);

router.get("/project02/movies", getData.getMovies);
router.get("/project02/allmovies", getData.getAllMovies);
router.post("/project02/movie", emptyMovieSession, setData.insertNewMovie);

/* EVERY TIME that we update or insert data, we need to empty the session so that the
   movie list and data can be updated the next time the page is loaded */
function emptyMovieSession(request, response, next) {
    request.session.dataList = "";
    /*if (request.session.dataList != "") {
		    request.session.destroy();
    }*/

    //console.log("continuing on to next function");
    next();
}

module.exports = router;