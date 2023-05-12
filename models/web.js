const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const WebSchema = new Schema({
    header: {
        type: String,
        required: true
        // unique: true
    },
    topic: {
        type: String,
        required: true
        // unique: true
    },

    followuplink: {
        type: String,
        required: 'URL can\'t be empty'
    },
});


let Web = mongoose.model("Web", WebSchema);
module.exports = Web;
