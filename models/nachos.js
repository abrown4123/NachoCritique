var mongoose = require("mongoose");

//SCHEMA SETUP
var nachoSchema = new mongoose.Schema({
    restaurant: String,
    image: String,
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});
    
module.exports = mongoose.model("Nacho", nachoSchema);