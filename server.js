var express = require("express");
var url = require("url");
var app = express();

app.get("/prove09", function(request, response) {
    console.log("Received a request for /prove09");

    response.render("prove09/server.js");
})