const mongoose = require('mongoose')

const teacher = new mongoose.Schema({
    user: mongoose.Types.ObjectId,
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
    field: mongoose.Types.ObjectId
})

module.exports = mongoose.model('teachers', teacher)
