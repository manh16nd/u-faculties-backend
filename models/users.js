const mongoose = require('mongoose')

const users = new mongoose.Schema({
    username: String,
    password: String,
    type: {
        type: String,
        enum: ['admin', 'teacher', 'staff']
    },
})

module.exports = mongoose.model('users', users)
