var express = require("express");
var url = require("url");
var app = express();

app.set("port", (process.env.PORT || 5000));
app.use(express.static("/public"));
app.set("views", "views");
app.set("view engine", "ejs");


/***********************************************************
 * teamActivity09 stuff 
 **********************************************************/
app.get("/team-activity09", function(request, response) {
    response.render("pages/team-activity09/form");
    console.log("got a request for /team-activity09");
})

app.get("/team-activity09/math", function(request, response) { 
    let result = calculate(request, response); 
    response.render("pages/team-activity09/math", {result: result}); 
    console.log("got a request for pages/team-activity09/math");
});

app.get("/team-activity09/math_service", function(request, response) { 
    let result = calculate(request, response); 
    response.json({"result": result}); 
    console.log("got a request for pages/team-activity09/math_service");
});

function calculate(req, res) {
    let query = url.parse(req.url, true).query;
        
    let lhs = parseFloat(query.lhs);
    let operation = query.operation;
    let rhs = parseFloat(query.rhs);
    let result = 0;

    if (operation == '+') {
        result = lhs + rhs;
    } else if (operation == '-') {
        result = lhs - rhs;
    } else if (operation == '*') {
        result = lhs * rhs;
    } else if (operation == '/') {
        result = lhs / rhs;
    } else {
        result = 0;
    }

    console.log("Result " + result);
    return result;
    //res.render('pages/team-activity09/math', {result: result});
}

/***********************************************************
 * prove09 stuff 
 **********************************************************/
app.get("/prove09/getRate", function(request, response) {
    console.log("Received a request for /prove09/getRate");
    var query = url.parse(request.url, true).query;
    var params = { weight: Number(query.weight), type: query.radioButtons };

    response.render("pages/prove09/getRate", params);
})


/***********************************************************
 * teamActivity10 stuff 
 **********************************************************/


/***********************************************************
 * set the server listening 
 **********************************************************/ 
app.listen(app.get("port"), function() {
	console.log("The server is up and listening on port 5000");
});