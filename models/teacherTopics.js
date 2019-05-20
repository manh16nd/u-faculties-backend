const mongoose = require('mongoose')

const teacherTopics = new mongoose.Schema({
    teacher: {type: mongoose.Types.ObjectId, ref: 'teachers'},
    topic: {type: mongoose.Types.ObjectId, ref: 'topics'}
})

module.exports = mongoose.model('teacher_topics', teacherTopics)
