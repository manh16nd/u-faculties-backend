const mongoose = require('mongoose')

const tokens = new mongoose.Schema({
    user: {type: mongoose.Types.ObjectId, ref: 'users'},
    value: String,
})

module.exports = mongoose.model('tokens', tokens)
