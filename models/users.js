const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
     fname: {
        type: String,
        required: true,
     },
    lname:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    phone:{
        type: String,
        required: true,
    },
    company:{
        type: String,
        required: true,
    },
    jobtitle:{
        type: String,
        required: true,
    },
    created:{
        type: Date,
        required: true,
        default: Date.now,
    },
});

module.exports = mongoose.model('User', userSchema);