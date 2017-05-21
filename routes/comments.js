var express = require("express");
var router = express.Router({mergeParams: true});
var Nacho = require("../models/nachos");
var Comment = require("../models/comments");

//====================================
//Comments routes
//====================================

router.get("/new", isLoggedIn, function(req, res){
    Nacho.findById(req.params.id, function(err, nacho){
        if (err){
            console.log(err);
        } else{
            res.render("comments/new", {nachos: nacho});
        }
    });
});

router.post("/", isLoggedIn, function(req, res){
    Nacho.findById(req.params.id, function(err, nacho){
       if (err){
           res.redirect("/nachos");
       } else{
           Comment.create(req.body.comment, function(err, comment){
               if(err){
                   console.log(err);
               } else{
                   //add id and username to comment
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                   //save comment
                   comment.save();
                   //save comment to nacho comments
                   nacho.comments.push(comment);
                   nacho.save();
                   res.redirect("/nachos/" + nacho._id);
               }
           });
       }
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
