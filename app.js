var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose")
    
//SCHEMA SETUP
var nachoSchema = new mongoose.Schema({
    restaurant: String,
    image: String,
    description: String
});
    
var Nacho = mongoose.model("Nacho", nachoSchema);

// Nacho.create(
//     {
//         restaurant: "Recipe",
//         image: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQfj6ggvxCG-RmmkM4dZ_K-LYCARN0mkAvomueUl24F5keaVn2a",
//         description: "These nachos were the best!"
//     }, function(err, nacho){
//         if(err){
//             console.log("There was an error");
//         } else{
//             console.log("New Campground: ");
//             console.log(nacho);
//         }
//     });

        
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
                res.render("index", {nachos: nachos});
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
            res.redirect("/index");
        }
    });
});

//NEW - Add new nacho reviews
app.get("/nachos/new", function(req, res){
    res.render("new");
});

//SHOW - shows more about one campground
app.get("nachos/:id", function(req, res){
    
    Nacho.findById( req.params.id, function(err, foundNacho){
       if(err){
           console.log(err);
       }else{
           res.render("show", {campground: foundNacho});
       }
    });
    
    
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The Server is Running");
});