const mongoose = require('mongoose')

const fields = new mongoose.Schema({
    name: String,
    parent: mongoose.Types.ObjectId,
})

module.exports = mongoose.model('fields', fields)
