var express = require("express");
var url = require("url");
var app = express();

app.use(express.static("public/prove09"));

app.set("views", "views/prove09");
app.set("view engine", "ejs");

app.get("/getRate", function(request, response) {
    console.log("Received a request for /getRate");
    var query = url.parse(request.url, true).query;
    var params = { weight: Number(query.weight), type: query.radioButtons };

    response.render("getRate", params);
})

app.listen(5000, function() {
	console.log("The server is up and listening on port 5000");
});