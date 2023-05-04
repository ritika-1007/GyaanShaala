const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        // unique: true
    },
    username: {
        type: String,
        required: true,
        // unique: true
    },
    // is_admin: {
    //     type: Number,
    //     required: true
    // },
    // is_verified: {
    //     type: Number,
    //     default: 0
    // }
});

UserSchema.plugin(passportLocalMongoose);

// handling the unique email error
UserSchema.post('save', function (error, doc, next) {
    if (error.name === 'MongoServerError' && error.code === 11000 && error.keyValue.email) {
        next(new Error('Email address was already taken, please choose a different one.'));
    } else {
        next(error);
    }
});

let User = mongoose.model("User", UserSchema);
module.exports = User;
