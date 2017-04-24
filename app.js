var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    Nacho      = require("./models/nachos"),
    seedDB     = require("./seeds");
    

seedDB();       
mongoose.connect("mongodb://localhost/nacho_critique");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("landing");
});

//Index - Shows all nachos
app.get("/nachos", function(req, res){
        Nacho.find({}, function(err, nachos){
            if(err){
                console.log("There was an error");
            } else{
                res.render("nachos/index", {nachos: nachos});
            } 
        });
});

//Create - add new Nachos
app.post("/nachos", function(req, res){
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
app.get("/nachos/new", function(req, res){
    res.render("nachos/new");
});

//SHOW - shows more about one campground
app.get("/nachos/:id", function(req, res){
    Nacho.findById(req.params.id).populate("comments").exec(function(err, foundNacho){
       if(err){
           console.log(err);
       }else{
           console.log(foundNacho);
           res.render("nachos/show", {nacho: foundNacho});
       }
    });
});

//====================================
//Comments routes
//====================================

app.get("/nachos/:id/comments/new", function(req, res){
    Nacho.findById(req.params.id, function(err, nacho){
        if (err){
            console.log(err);
        } else{
            res.render("comments/new", {nachos: nacho});
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The Server is Running");
});