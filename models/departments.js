const mongoose = require('mongoose')

const departments = new mongoose.Schema({
    name: String,
    type: String,
    address: String,
    phone: String,
    website: String,
    type: {
        type: String,
        enum: [''],
    }
})

module.exports = mongoose.model('departments', departments)
