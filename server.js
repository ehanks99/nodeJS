var express = require("express");
var url = require("url");
var app = express();
let parser = require("body-parser");

app.use(parser.urlencoded({extended: false}));

app.set("port", (process.env.PORT || 5000));
app.use(express.static("public"));
app.set("views", "views");
app.set("view engine", "ejs");


/***********************************************************
 * teamActivity09 stuff
 **********************************************************/
app.use(require("./servers/teamActivity09/teamActivity09.js"));

/***********************************************************
 * prove09 stuff 
**********************************************************/
app.use(require("./servers/prove09/prove09.js"));

/***********************************************************
 * teamActivity10 stuff 
 **********************************************************/
app.use(require("./servers/teamActivity10/teamActivity10.js"));

/***********************************************************
 * project 02 stuff 
 **********************************************************/
app.use(require("./servers/project02/project02.js"));

/***********************************************************
 * teamActivity12 stuff 
 **********************************************************/
app.use(require("./servers/teamActivity12/teamActivity12.js"));

/***********************************************************
 * set the server listening 
 **********************************************************/ 
app.listen(app.get("port"), function() {
	console.log("The server is up and listening on port 5000");
});

// jwt - java web token