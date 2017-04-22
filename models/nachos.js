var mongoose = require("mongoose");

//SCHEMA SETUP
var nachoSchema = new mongoose.Schema({
    restaurant: String,
    image: String,
    description: String
});
    
module.exports = mongoose.model("Nacho", nachoSchema);