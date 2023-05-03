const mongoose = require("mongoose");


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
    feedback: {
        type: String,
        // required: true,
        minLength: 3
    }
})

const UserFeedback = mongoose.model('UserFeedback', userfeedbackSchema);
module.exports = UserFeedback;
