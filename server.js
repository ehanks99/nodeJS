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
    .get('/team-activity09', (req, res) => res.render('pages/team-activity09/form'))
    .get('/team-activity09/math', (req, res) => { let result = calculate(req, res); res.render('pages/team-activity09/math', {result: result}); })
    .get('/team-activity09/math_service', (req, res) => { let result = calculate(req, res); res.json({"result": result}); });

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
