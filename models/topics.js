const mongoose = require('mongoose')

const topics = new mongoose.Schema({
    name: String,
    description: String,
})

module.exports = mongoose.model('topics', topics)
