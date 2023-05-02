const mongoose = require("mongoose");
const validator = require("validator");

const userfeedbackSchema = mongoose.Schema({
    name: {
        type: String,
        // required: true,
        minLength: 3
    },
    year: {
        type: Number,
        min: 1999,
        max: 2023
    },
    message: {
        type: String,
        // required: true,
        minLength: 3
    }
})

const UserFeedback = mongoose.model('UserFeedback', userfeedbackSchema);
module.exports = UserFeedback;
