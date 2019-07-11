var express = require("express");
var url = require("url");
//var app = express();
let router = express.Router();
let parser = require("body-parser");

router.use(parser.urlencoded({extended: false}));


var session = require('express-session');
//var FileStore = require('session-file-store')(session);
// set up the session
router.use(session({
  secret: 'my-super-secret-secret!',
  resave: false,
  saveUninitialized: true
}))
/*
app.use(session({
  key: "12345",
  name: 'server-session-cookie-id',
  secret: 'my express secret',
  saveUninitialized: true,
  resave: true,
  //store: new FileStore()
}));
*/
router.post("/team-activity12/login", function(req, res) {
    console.log("made it to the login");
    let username = req.body.username;
    let password = req.body.password;
	let result = {success: false};
    
    console.log("username: " + username);
    console.log("password: " + password);

    //console.log(req.session);

    if (username === "admin" && password === "password") {
        //req.session.loggedIn = true;
        //res.json({success: true});
		req.session.user = req.body.username;
		result = {success: true};
    }
    
	res.json(result);
});

router.post("/team-activity12/logout", function(req, res) {
    console.log("made it to the logout");
    console.log(req.session.loggedIn);

	let result = {success: false};

	// We should do better error checking here to make sure the parameters are present
	if (req.session.user) {
		req.session.destroy();
		result = {success: true};
	}

	res.json(result);
});


// This method has a middleware function "verifyLogin" that will be called first
router.get('/team-activity12/getServerTime', verifyLogin, getServerTime);

// This function returns the current server time
function getServerTime(req, res) {
	var time = new Date();
	
	var result = {success: true, time: time};
	res.json(result); 
}

// This is a middleware function that we can use with any request
// to make sure the user is logged in.
function verifyLogin(req, res, next) {
	if (req.session.user) {
		// They are logged in!

		// pass things along to the next function
		next();
	} else {
		// They are not logged in
		// Send back an unauthorized status
		var result = {success:false, message: "Access Denied"};
		res.status(401).json(result);
	}
}
/*
app.get("/team-activity12/getServerTime", function(req, res) {
    console.log("made it to the getServerTime");
});
*/

module.exports = router;