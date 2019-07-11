var express = require("express");
var url = require("url");
//var app = express();
let router = express.Router();
let parser = require("body-parser");

router.use(parser.urlencoded({extended: false}));

router.get("/prove09/getRate", function(request, response) {
    console.log("Received a request for /prove09/getRate");
    var query = url.parse(request.url, true).query;
    var params = { weight: Number(query.weight), type: query.radioButtons };

    response.render("pages/prove09/getRate", params);
})

module.exports = router;