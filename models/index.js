const authorsSchema = require('./authors')
const mongoose = require('mongoose')

exports.Authors = mongoose.model('authors', authorsSchema)
