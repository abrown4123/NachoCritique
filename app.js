var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    passport   = require("passport"),
    localStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    User       = require("./models/user"),
    Nacho      = require("./models/nachos"),
    Comment    = require("./models/comments"),
    seedDB     = require("./seeds"),
    flash      = require("connect-flash");

var commentRoutes = require("./routes/comments"),
    nachosRoutes  = require("./routes/nachos"),
    indexRoutes   = require("./routes/index");

//seedDB(); seeds nachos     

mongoose.connect(process.env.DATABASEURL);


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());

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

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use(indexRoutes);
app.use("/nachos/:id/comments", commentRoutes);
app.use("/nachos", nachosRoutes);



app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The Server is Running");
});