var express = require("express");
var url = require("url");
//var app = express();
let router = express.Router();
let parser = require("body-parser");
let getData = require("./serverFunctions/getDataFunctions.js");
let setData = require("./serverFunctions/setDataFunctions.js");

router.use(parser.urlencoded({extended: false}));

router.get("/project02", function(request, response) {
    response.render("pages/project02/mainPage");
});

router.get("/project02/mainPage", function(request, response) {
    response.render("pages/project02/mainPage");
});

router.get("/project02/getAllMovieData", getData.collectAllMovieData);

router.get("/project02/directors", getData.getDirectors);
router.post("/project02/director", setData.postDirector);

router.get("/project02/actors", getData.getActors);
router.post("/project02/actor", setData.postActor);

router.get("/project02/genres", getData.getGenres);
router.post("/project02/genre", setData.postGenre);

router.get("/project02/movies", getData.getMovies);
//router.post("/project02/movie", setData.postGenre);

module.exports = router;