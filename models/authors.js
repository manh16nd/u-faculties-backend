const mongoose = require('mongoose')

const authors = new mongoose.Schema({
    name: String
})

exports.default = authors
