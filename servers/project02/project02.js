var express = require("express");
var url = require("url");
//var app = express();
let router = express.Router();
let parser = require("body-parser");
let getData = require("./serverFunctions/movieDataListFunctions.js");

router.use(parser.urlencoded({extended: false}));

router.get("/project02", function(request, response) {
    response.render("pages/project02/mainPage");
});

router.get("/project02/mainPage", function(request, response) {
    response.render("pages/project02/mainPage");
});

router.get("/project02/getAllMovieData", getData.collectAllMovieData);


module.exports = router;