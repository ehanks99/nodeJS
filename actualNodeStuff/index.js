const express = require('express');
const path = require('path');
let url = require('url');
const PORT = process.env.PORT || 5000;

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/team-activity09/form'))
  .get('/math', (req, res) => { let result = calculate(req, res); res.render('pages/team-activity09/math', {result: result}); })
  .get('/math_service', (req, res) => { let result = calculate(req, res); res.json({"result": result}); })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

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