const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PdfSchema = new Schema({
    url: String,
    filename: String
});


const PyqSchema = new Schema({
    semester: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true,
        // unique: true
    },
    pdf: [PdfSchema]
});


let Pyq = mongoose.model("Pyq", PyqSchema);
module.exports = Pyq;
