const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PdfSchema = new Schema({
    url: String,
    filename: String
});


const PptSchema = new Schema({
    semester: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    pdf: [PdfSchema]
});


let Ppt = mongoose.model("Ppt", PptSchema);
module.exports = Ppt;
