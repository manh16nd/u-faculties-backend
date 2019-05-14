const mongoose = require('mongoose')

const tokens = new mongoose.Schema({
    user: mongoose.Types.ObjectId,
    value: String,
})

module.exports = mongoose.model('tokens', tokens)
