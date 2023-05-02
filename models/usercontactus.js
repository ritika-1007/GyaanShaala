const mongoose = require("mongoose");
const validator = require("validator");

const usercontactusSchema = mongoose.Schema({
    name: {
        type: String,
        // required: true,
        minLength: 3
    },
    email: {
        type: String,
        // required: true,
        validate(value) {
            if (!validator.isEmail(value))
                throw new Error("Invalid email id")
        }
    },
    phone: {
        type: Number,
        // required: true,
        min: 10
    },
    message: {
        type: String,
        // required: true,
        minLength: 3
    }
})

const UserContactUs = mongoose.model('UserContactUs', usercontactusSchema);
module.exports = UserContactUs;