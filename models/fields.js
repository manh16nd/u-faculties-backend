const mongoose = require('mongoose')

const fields = new mongoose.Schema({
    name: String,
    children: [mongoose.Schema.Types.ObjectId],
})

module.exports = mongoose.model('fields', fields)
