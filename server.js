var express = require("express");
var url = require("url");
var app = express();

app.use(express.static("public"));
app.set("views", "views");
app.set("view engine", "ejs");

app.listen(5000, function() {
	console.log("The server is up and listening on port 5000");
});

/* teamActivity09 stuff */
express()
    .get('/team-activity09', (req, res) => res.render('pages/team-activity09/form'));