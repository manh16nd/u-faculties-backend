const mongoose = require('mongoose')

const teacher = new mongoose.Schema({
    name: String,
})

module.exports = mongoose.model('teachers', teacher)
