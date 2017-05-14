var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    passport   = require("passport"),
    localStrategy = require("passport-local"),
    User       = require("./models/user"),
    Nacho      = require("./models/nachos"),
    Comment    = require("./models/comments"),
    seedDB     = require("./seeds");
    

seedDB();       
mongoose.connect("mongodb://localhost/nacho_critique");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

//PASSPORT CONFIGURATION

app.use(require("express-session")({
    secret: "This is a secret!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Landing Page
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

app.post("/nachos/:id/comments", function(req, res){
    Nacho.findById(req.params.id, function(err, nacho){
       if (err){
           res.redirect("/nachos");
       } else{
           Comment.create(req.body.comment, function(err, comment){
               if(err){
                   console.log(err);
               } else{
                   nacho.comments.push(comment);
                   nacho.save();
                   res.redirect("/nachos/" + nacho._id);
               }
           });
       }
    });
});

//====================================
//AUTH Routes
//====================================

//show register form
app.get("/register", function(req, res){
    res.render("register");
});

//handle sign up logic
app.post("/register", function(req,res){
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
app.get("/login", function(req, res){
    res.render("login");
});

//handle login logic
app.post("/login", passport.authenticate("local",{
    successRedirect: "/nachos/show",
    failureRedirect: "/login"
}),
    function(req, res){
});

//Logout Route
app.get("/logout", function(req, res){
   req.logout();
   res.redirect("/");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The Server is Running");
});