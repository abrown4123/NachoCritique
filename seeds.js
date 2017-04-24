var mongoose = require("mongoose"),
    Nacho    = require("./models/nachos"),
    Comment  = require("./models/comments");
    
var data = [
    {
        restaurant: "Chilis",
        image: "https://static.olocdn.net/menu/chilis/01b139aba3b7b283cce78572538aa60e.jpg",
        description: "These are great!"
    },
    {
        restaurant: "Pluckers",
        image: "http://images1.houstonpress.com/imager/u/original/6432363/nachospluckersuse.jpg",
        description: "These aren't the best.."
    },
    {
        restaurant: "Betty Crocker",
        image: "https://images-gmi-pmc.edge-generalmills.com/2fecc878-7b3f-4dc1-b3cf-31807d551ce8.jpg",
        description: "Save the $$$ and dine in!"
    }
];
    
    
    
    
function seedDB(){
    //Remove nachos
    Nacho.remove({}, function(err){
        if(err){
            console.log(err);
        } else{
            //Create new nachos and a comment for each one
            console.log("nachos removed");
            data.forEach(function(seed){
                Nacho.create(seed, function(err, nacho){
                    if(err){
                        console.log(err);
                    } else{
                        console.log("comment created");
                        Comment.create(
                            {
                                text: "I really like these.",
                                author: "James Bond"
                            }, function(err, comment){
                                if (err){
                                    console.log(err);
                                } else{
                                    nacho.comments.push(comment);
                                    nacho.save();
                                }
                            });
                        }
                });
            });
        }
    });
}

module.exports = seedDB;