const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PdfSchema = new Schema({
    url: String,
    filename: String
});


const BookSchema = new Schema({
    name: {
        type: String,
        required: true,
        // unique: true
    },
    subject: {
        type: String,
        required: true,
        // unique: true
    },
    pdf: [PdfSchema]

});


let Book = mongoose.model("Book", BookSchema);
module.exports = Book;
