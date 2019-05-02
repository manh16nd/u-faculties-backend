const mongoose = require('mongoose')

const users = new mongoose.Schema({
    username: String,
    password: String,
    type: String,
})

module.exports = mongoose.model('users', users)
