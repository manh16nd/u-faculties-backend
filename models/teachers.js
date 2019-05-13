const mongoose = require('mongoose')

const teacher = new mongoose.Schema({
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
    user: mongoose.Types.ObjectId,
})

module.exports = mongoose.model('teachers', teacher)
