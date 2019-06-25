var express = require("express");
var url = require("url");
var app = express();

app.use(express.static("public"));

app.set("views", "views");
app.set("view engine", "ejs");

app.get("/ponder09/getRate", function(request, response) {
    console.log("Received a request for /getRate");
    var query = url.parse(request.url, true).query;
    var params = { weight: Number(query.weight), type: query.radioButtons };

    response.render("getRate", params);
})

app.listen(5000, function() {
	console.log("The server is up and listening on port 5000");
});