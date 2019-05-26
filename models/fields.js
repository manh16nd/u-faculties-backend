const mongoose = require('mongoose')

const fields = new mongoose.Schema({
    name: String,
    parent: [mongoose.Schema.Types.ObjectId],
    teachers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'teachers',
        default: []
    }]
})

module.exports = mongoose.model('fields', fields)
