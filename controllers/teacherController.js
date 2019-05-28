const getTeachersActions = require('../actions/teachers/teacherActions')
const { verifyHeaders } = require('../helpers/bcrypt')

exports.getTeachers = (req, res) => {
    const { limit, page, name, email, vnuEmail, phone, address, website, degree, position } = { ...req.query }

    getTeachersActions.getTeachers({ limit, page, name, email, vnuEmail, phone, address, website, degree, position })
        .then(data => res.send({ success: true, data }))
        .catch(err => res.send({ success: false, message: err.message || err }))
}

exports.getOneTeacher = (req, res) => {
    const { id } = { ...req.params }
    getTeachersActions.getOneTeacher(id)
        .then(data => res.send({ success: true, data }))
        .catch(err => res.send({ success: false, message: err.message || err }))
}

exports.addTeacher = (req, res) => {
    const { name, username, email, vnuEmail, phone, address, website, degree, position, department, field } = { ...req.body }

    getTeachersActions.addTeacher({
        name,
        username,
        email,
        vnuEmail,
        phone,
        address,
        website,
        degree,
        position,
        department,
        field
    })
        .then(data => res.send({ success: true, data }))
        .catch(err => res.send({ success: false, message: err.message || err }))
}

exports.editTeacher = (req, res) => {
    const { id, name, email, vnuEmail, phone, address, website, degree, position, department } = { ...req.body, ...req.params }
    console.log(id)
    getTeachersActions.editTeacher({ id, name, email, vnuEmail, phone, address, website, degree, position, department })
        .then(teacher => res.send({ success: true, teacher }))
        .catch(err => res.send({ success: false, message: err.message || err }))
}

exports.deleteTeacher = (req, res) => {
    const { id } = { ...req.params }

    getTeachersActions.editTeacher({ id })
        .then(teacher => res.send({ success: true, teacher }))
        .catch(err => res.send({ success: false, message: err.message || err }))
}

exports.uploadAvatar = (req, res) => {
    const { file, id } = { ...req, ...req.params }

    getTeachersActions.uploadAvatar(file, id)
        .then(avatar => res.send({ success: true, avatar }))
        .catch(err => res.send({ success: false, message: err.message || err }))
}

const teacherFieldsActions = require('../actions/teachers/teacherFieldsActions')

exports.addTeacherToFields = (req, res) => {
    const { id, fields } = { ...req.params, ...req.body }

    teacherFieldsActions.addTeacherToFields({ teacherId: id, fields })
        .then(teacher => res.send({ success: true, teacher }))
        .catch(err => res.send({ success: false, message: err.message || err }))
}

exports.removeTeacherFromFields = (req, res) => {
    const { id, fields } = { ...req.params, ...req.body }

    teacherFieldsActions.removeTeacherFromFields({ teacherId: id, fields })
        .then(teacher => res.send({ success: true, teacher }))
        .catch(err => res.send({ success: false, message: err.message || err }))
}

const teacherTopicActions = require('../actions/teachers/topicTeacherActions')
exports.getTeacherTopics = (req, res) => {
    const { id } = { ...req.params }
    teacherTopicActions.getTeacherTopics({ teacherId: id })
        .then(data => res.send({ success: true, data }))
        .catch(err => res.send({ success: false, message: err.message }))
}

exports.addTeacherToTopic = (req, res) => {
    const { id, topics } = { ...req.params, ...req.body }
    teacherTopicActions.addTeacherToTopics({ teacherId: id, topics })
        .then(teacher => res.send({ success: true, teacher }))
        .catch(err => res.send({ success: false, message: err.message || err }))
}

exports.removeTeacherFromTopics = (req, res) => {
    const { id, topics } = { ...req.params, ...req.body }
    teacherTopicActions.removeTeacherFromTopics({ teacherId: id, topics })
        .then(teacher => res.send({ success: true, teacher }))
        .catch(err => res.send({ success: false, message: err.message || err }))
}

exports.importExcel = (req, res) => {
    const {file} = {...req}
    getTeachersActions.importExcel(file)
        .then(teacher => res.send({ success: true, teacher }))
        .catch(err => res.send({ success: false, message: err.message || err }))
}

