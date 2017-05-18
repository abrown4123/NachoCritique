var express = require("express");
var router = express.Router();
var Nacho = require("../models/nachos");
var Comment = require("../models/comments");


//Index - Shows all nachos
router.get("/", function(req, res){
        Nacho.find({}, function(err, nachos){
            if(err){
                console.log("There was an error");
            } else{
                res.render("nachos/index", {nachos: nachos});
            } 
        });
});

//Create - add new Nachos
router.post("/", function(req, res){
    var place = req.body.restaurant;
    var image = req.body.image;
    var description = req.body.description;
    var newNachos = {restaurant: place, image: image, description: description};
    Nacho.create(newNachos, function(err, newNacho){
        if(err){
            console.log("There was an error");
        } else{
            res.redirect("/nachos");
        }
    });
});

//NEW - Add new nacho reviews
router.get("/new", function(req, res){
    res.render("nachos/new");
});

//SHOW - shows more about one campground
router.get("/:id", function(req, res){
    Nacho.findById(req.params.id).populate("comments").exec(function(err, foundNacho){
       if(err){
           console.log(err);
       }else{
           res.render("nachos/show", {nacho: foundNacho});
       }
    });
});

module.exports = router;