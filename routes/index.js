var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");


//Landing Page
router.get("/", function(req, res){
    res.render("landing");
});


//show register form
router.get("/register", function(req, res){
    res.render("register");
});

//handle sign up logic
router.post("/register", function(req,res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/nachos"); 
        });
    });
});

//show login form
router.get("/login", function(req, res){
    res.render("login");
});

//handle login logic
router.post("/login", passport.authenticate("local",{
    successRedirect: "/nachos",
    failureRedirect: "/login"
}),
    function(req, res){
});

//Logout Route
router.get("/logout", function(req, res){
   req.logout();
   res.redirect("/");
});

//Middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;