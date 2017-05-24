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

//Edit comment route
router.get("/:comment_id/edit", commentAuthCheck, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else{
            res.render("comments/edit", {nacho_id: req.params.id, comment: foundComment});
        }
    });
});

//Comment Update
router.put("/:comment_id", commentAuthCheck ,function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, newComment){
        if(err){
            res.redirect("back");
        } else{
            res.redirect("/nachos/" + req.params.id);
        }
    });
});

//Delete Comment
router.delete("/:comment_id", commentAuthCheck, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else{
           res.redirect("/nachos/" + req.params.id );
       }
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

function commentAuthCheck(req, res, next){
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
}

module.exports = router;
