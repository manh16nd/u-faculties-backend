const mongoose = require('mongoose')

const fields = new mongoose.Schema({
    name: String,
    parent: mongoose.Types.ObjectId,
    teacher: {types: [mongoose.Types.ObjectId], 'default': []}
})

module.exports = mongoose.model('fields', fields)
