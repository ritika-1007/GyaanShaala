const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const discussionSchema = new Schema({
    title: {
        type: String,
        required: true,
        // unique: true
    },
    createdby: {
        type: String,
        required: true,
        // unique: true
    },
    text: {
        type: String,
        required: true,
        // unique: true
    },
    comments:
    {type:Array,"default" : [],unique:false },
},{timestamps:true});


discussionSchema.plugin(passportLocalMongoose);

// handling the unique email error
discussionSchema.post('save', function (error, doc, next) {
    if (error.name === 'MongoServerError' && error.code === 11000 && error.keyValue.email) {
        next(new Error('Email address was already taken, please choose a different one.'));
    } else {
        next(error);
    }
});

module.exports = mongoose.model('Discussion', discussionSchema);