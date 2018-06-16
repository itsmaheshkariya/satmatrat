let mongoose = require('mongoose');


//articleSchema


let settingsSchema = mongoose.Schema({

    message: {
        type: String,
        required: false
    },
    title: {
        type: String,
        required: false
    }



});


let Settings = module.exports = mongoose.model('Settings', settingsSchema);