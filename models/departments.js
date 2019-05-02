const mongoose = require('mongoose')

const departments = new mongoose.Schema({
    name: String,
})

module.exports = mongoose.model('departments', departments)
