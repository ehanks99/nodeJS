var express = require("express");
var url = require("url");
//var app = express();
let router = express.Router();
let parser = require("body-parser");
let getData = require("./serverFunctions/getDataFunctions.js");
let setData = require("./serverFunctions/setDataFunctions.js");


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

router.get("/project02/edit-add/:page", function(request, response) {
    let page = request.params.page;
    response.render("pages/project02/editAdd.ejs", {page: page})
});


router.get("/project02/getAllMovieData", getData.collectAllMovieData);

router.get("/project02/directors", getData.getDirectors);
router.get("/project02/alldirectors", getData.getAllDirectors);
router.post("/project02/director", destroySession, setData.insertNewDirector);
router.post("/project02/update/director", destroySession, setData.updateDirector);

router.get("/project02/actors", getData.getActors);
router.get("/project02/allactors", getData.getAllActors);
router.post("/project02/actor", destroySession, setData.insertNewActor);
router.post("/project02/update/actor", destroySession, setData.updateActor);

router.get("/project02/genres", getData.getGenres);
router.get("/project02/allgenres", getData.getAllGenres);
router.post("/project02/genre", destroySession, setData.insertNewGenre);
router.post("/project02/update/genre", destroySession, setData.updateGenre);

router.get("/project02/movies", getData.getMovies);
router.get("/project02/allmovies", getData.getAllMovies);
router.post("/project02/movie", destroySession, setData.insertNewMovie);

/* EVERY TIME that we update or insert data, we need to destroy the session so that the
   movie list and data can be updated the next time the page is loaded */
function destroySession(request, response, next) {
    if (request.session.dataList) {
		    request.session.destroy();
    }

    //console.log("continuing on to next function");
    next();
}

module.exports = router;