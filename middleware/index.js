var Nacho = require("../models/nachos");
var Comment = require("../models/comments");

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login!");
    res.redirect("/login");
};

middlewareObj.authCheck = function(req, res, next){
    if(req.isAuthenticated()){
        Nacho.findById(req.params.id, function(err, foundNacho){
            if(err){
                res.redirect("back");
            } else{
                if(foundNacho.author.id.equals(req.user._id)){
                    next();
                } else{
                    res.redirect("back");
                }
            }
        });
    } else{
        res.redirect("back");
    }
};

middlewareObj.commentAuthCheck = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else{
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else{
                    res.redirect("back");
                }
            }
        });
    } else{
        res.redirect("back");
    }
};


module.exports = middlewareObj;