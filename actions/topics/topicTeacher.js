const {Teachers, Topics, TeacherTopic} = require('../../models')
const {isObjectId} = require('../../helpers/validators/typeValidators')

const _validateTopics = (topics, userFields) => {
    return topics.filter((topic) => isObjectId(topic) && !userFields.includes(topic))
}

const _validateRemoveTopics = (topics, userFields) => {
    return topics.filter((topic) => isObjectId(topic) && userFields.includes(topic))
}

const _addTeacherToTopic = async (topicID, teacher) => {
    const topic = await Topics.findOne({
        _id: topicID
    }).select('_id teachers')

    if (!topic) return null
    if (topic.teachers.includes(teacher._id)) return null

    topic.teachers = [...topic.teachers, teacher._id]
    teacher.topics = [...teacher.topics, topic._id]
    const teacherTopic = new TeacherTopic({
        teacher: teacher._id,
        topic: topic._id,
    })

    return await Promise.all([
        teacher.save(),
        topic.save(),
        teacherTopic.save(),
    ])
}

const _removeTeacherFromTopic = async (topicID, teacher) => {
    const topic = await Topics.findOne({
        _id: topicID
    }).select('_id teachers')

    if (!topic) return null
    if (!topic.teachers.includes(teacher._id)) return null

    topic.teachers = topic.teachers.filter((item) => item.toString() !== teacher._id.toString())
    teacher.topics = teacher.topics.filter((item) => item.toString() !== topic._id.toString())
    const teacherTopic = await TeacherTopic.findOne({
        teacher: teacher._id,
        topic: topic._id,
    })

    return await Promise.all([
        teacher.save(),
        topic.save(),
        teacherTopic ? teacherTopic.delete() : null,
    ])
}

exports._addTeacherToTopics = async ({teacherId, topics}) => {
    const teacher = await Teachers.findOne({
        _id: teacherId
    }).select('_id fields')
    if (!teacher) throw new Error('Teacher not found')

    const validTopics = _validateTopics(topics, teacher.topics)
    const work = validTopics.map((field) => {
        return _addTeacherToTopic(field, teacher)
    })

    return await Promise.all(work)
}

exports.removeTeacherFromTopics = async ({teacherId, topics}) => {
    const teacher = await Teachers.findOne({
        _id: teacherId
    }).select('_id fields')
    if (!teacher) throw new Error('Teacher not found')
    const validFields = _validateRemoveTopics(topics, teacher.topics)
    const work = validFields.map((topic) => {
        return _removeTeacherFromTopic(topic, teacher)
    })

    return await Promise.all(work)
}
