const mongoose = require('mongoose')

const authors = new mongoose.Schema({
    name: String,
    student_code: String,
})

module.exports = mongoose.model('authors', authors)
