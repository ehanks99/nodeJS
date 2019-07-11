var express = require("express");
var url = require("url");
//var app = express();
let router = express.Router();
let parser = require("body-parser");

router.use(parser.urlencoded({extended: false}));



router.get("/team-activity09", function(request, response) {
    response.render("pages/team-activity09/form");
    console.log("got a request for /team-activity09");
})

router.get("/team-activity09/math", function(request, response) { 
    let result = calculate(request, response); 
    response.render("pages/team-activity09/math", {result: result}); 
    console.log("got a request for pages/team-activity09/math");
});

router.get("/team-activity09/math_service", function(request, response) { 
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

module.exports = router;