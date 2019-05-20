const mongoose = require('mongoose')

const topics = new mongoose.Schema({
    name: String,
    description: String,
    teachers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'teachers',
        default: []
    }]
})

module.exports = mongoose.model('topics', topics)
