const mongoose = require('mongoose')

const types = ['Bộ môn', 'Phòng']

const departments = new mongoose.Schema({
    name: String,
    address: String,
    phone: String,
    website: String,
    type: {
        enum: types,
        default: 'Bộ môn',
        type: String
    }
})

module.exports = mongoose.model('departments', departments)
