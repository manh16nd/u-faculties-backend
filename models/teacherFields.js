const mongoose = require('mongoose')

const teacherField = new mongoose.Schema({
    teacher: {type: mongoose.Types.ObjectId, ref: 'teachers'},
    field: {type: mongoose.Types.ObjectId, ref: 'fields'},
})

module.exports = mongoose.model('teacher_fields', teacherField)
