const mongoose = require('mongoose')

const {Types} = mongoose.Schema
const teachers = new mongoose.Schema({
    userId: Types.ObjectId, 
})
