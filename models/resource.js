const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ResourceSchema = new Schema({
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


let Resource = mongoose.model("Resource", ResourceSchema);
module.exports = Resource;
