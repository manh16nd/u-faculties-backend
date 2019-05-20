const mongoose = require('mongoose')

const teacher = new mongoose.Schema({
    user: {type: mongoose.Types.ObjectId, ref: 'users'},
    name: String,
    email: String,
    vnuEmail: String,
    phone: String,
    address: String,
    department: mongoose.Types.ObjectId,
    website: String,
    degree: {
        type: String,
        enum: ['master', 'phd', 'doctor']
    },
    position: String,
    avatar: String,
})

module.exports = mongoose.model('teachers', teacher)
