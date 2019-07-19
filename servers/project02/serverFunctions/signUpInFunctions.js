let express = require("express");
let parser = require("body-parser");
const { Pool } = require("pg");
const bcrypt = require('bcrypt');
const saltRounds = 12;

let router = express.Router();
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({connectionString: connectionString});

router.use(parser.urlencoded({extended: false}));

function runQuery(sql, params, callback) {
    pool.query(sql, params, function(error, result) {
        // message indicating success or failure
        //let message = {success:true, data: result};

        if (error) {
            console.log("An error with the DB occurred");
            console.log(error);

            callback(error, result);
            //message = {success:false, error:error.detail};
        }
        
        callback(null, result);
        //response.json(message);
    })
}

function validateLogin(request, response) {
    // grab the username and password passed in
    let username = request.body.username;
    let plainTextPassword = request.body.password;
    console.log(username + "   " + plainTextPassword);

    let sql = "SELECT username, pswrd, email, first_name, last_name, is_admin FROM login_info WHERE username = $1";
    let params = [request.body.username];
    
    // send the sql query and params to be executed
    runQuery(sql, params, function(error, result) {
        let message = {success:true};

        if (error) {
            message = {success: false, error: error};
            response.json(message);
        }
        else {
            bcrypt.hash(plainTextPassword, saltRounds, function(err, hash) {
                if (err) {
                    message = {success: false, error: error};
                    response.json(message);
                }

                // we got the DB results back -> see if the passwords match
                bcrypt.compare(plainTextPassword, hash, function(innerErr, res) {
                    if (innerErr) {
                        message = {success: false, error: innerErr};
                    }
                    else if (res == false) {
                        message = {success: false, error: "Wrong password"};
                    }
                    else if (res == true) {
                        // we've been given a valid username-password pair -> log the user in
                        request.session.isLoggedIn = true;

                        // if the username given is the admin one, set that session vairable
                        if (username == "admin")
                            request.session.isAdmin = true;
                        else
                            request.session.isAdmin = false;
                    }
                    response.json(message);
                });
            });
        }
    });
}

function signUp(request, response) {
    // grab data
    let username = request.body.username;
    let plainTextPassword = request.body.password;
    let firstName = request.body.firstName;
    let lastName = request.body.lastName;
    let email = request.body.email;

    // first, we need to hash the given password -> then put it in the DB
    bcrypt.hash(plainTextPassword, saltRounds, function(err, hash) {
        // if we have an error, return success=false
        if (err) response.json({success: false});
        console.log(plainTextPassword + "   " + hash);

        let sql = "INSERT INTO login_info (login_info_id, username, pswrd, email, first_name, last_name, is_admin) " +
                  "VALUES (nextval('login_info_s1'), $1, $2, $3, $4, $5, 'N')";
        let params = [username, hash, email, firstName, lastName];
        
        // send the sql query and params to be executed
        runQuery(sql, params, function(error, result) {
            if (error) {
                console.log("failed to insert user");
                response.json({success: false});
            }
            else {
                console.log("successfully inserted user");
                // log the user in
                request.session.isLoggedIn = true;
                response.json({success: true});
            }
        });
    });
}

function getLoginStatus(request, response) {
    let loggedIn = false;
    let admin = false;
    if (request.session.isLoggedIn && request.session.isLoggedIn == true)
        loggedIn = true;
    if (request.session.isAdmin && request.session.isAdmin == true);
        admin = true;

    response.json({isLoggedIn: loggedIn, isAdmin: admin});
}

function logoutOfSession(request, response) {
    // clear the login session variables
    request.session.isLoggedIn = false;
    request.session.isAdmin = false;

    response.json({success: true});
}

function isUniqueUsername(request, response) {
    let sql = "SELECT username FROM login_info WHERE username = $1";
    let params = [request.body.username];

    // send the sql query and params to be executed
    runQuery(sql, params, function(error, result) {
        let message = {isUniqueUsername: false};

        if (result == null || result.rows == 0) {
            message = {isUniqueUsername: true};
        }

        response.json(message);
    });
}

module.exports = {
    validateLogin: validateLogin,
    signUp: signUp,
    getLoginStatus: getLoginStatus,
    isUniqueUsername: isUniqueUsername,
    logout: logout
}