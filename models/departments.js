const mongoose = require('mongoose')

const departments = new mongoose.Schema({
    name: String,
    type: String,
    address: String,
    phone: String,
    website: String
})

module.exports = mongoose.model('departments', departments)
