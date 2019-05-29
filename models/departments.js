const mongoose = require('mongoose')

const types = ['bo mon']

const departments = new mongoose.Schema({
    name: String,
    address: String,
    phone: String,
    website: String,
    type: {
        enum: types,
        default: 'bo mon',
        type: String
    }
})

module.exports = mongoose.model('departments', departments)
