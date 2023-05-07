const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const SubjectSchema = new Schema({
    topic: {
        type: String,
        required: true
        // unique: true
    },
    noteslink: {
        type: String,
        required: 'URL can\'t be empty'
    },
    playlistlink: {
        type: String,
        required: 'URL can\'t be empty'
    },
    queslink: {
        type: String,
        required: 'URL can\'t be empty'
    },
});


let Subject = mongoose.model("Subject", SubjectSchema);
module.exports = Subject;
