const mongoose = require('mongoose')

const departments = new mongoose.Schema({
    name: String,
    address: String,
    phone: String,
    website: String,
    type: {
        enum: ['bo mon'],
        default: 'bo mon',
        type: String
    }
})

module.exports = mongoose.model('departments', departments)
