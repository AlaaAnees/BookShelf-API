const validator = require('validator');
const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    "_id": Number,
    "title": String,
    "isbn": String,
    "pageCount": Number,
    "publishedDate":Object,
    "thumbnailUrl": String,
    "shortDescription": String,
    "status": String,
    "authors": Array,
    "categories": Array,
    "quantity":Number,
    "price":Number,
    "review":{type:Array}

})
module.exports = mongoose.model("Books",BookSchema);