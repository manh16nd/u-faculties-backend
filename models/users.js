const mongoose = require('mongoose')

const users = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    status: {
        status: String,
        enum: ['active', 'inactive']
    },
    type: {
        type: String,
        enum: ['admin', 'teacher', 'staff']
    },
})

module.exports = mongoose.model('users', users)
