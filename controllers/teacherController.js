const getTeachersActions = require('../actions/teachers/teacherActions')
const {verifyHeaders} = require('../helpers/bcrypt')

exports.getTeachers = (req, res) => {
    const {limit, page, name, email, vnuEmail, phone, address, website, degree, position} = {...req.query}

    getTeachersActions.getTeachers({limit, page, name, email, vnuEmail, phone, address, website, degree, position})
        .then(data => res.send({success: true, data}))
        .catch(err => res.send({success: false, message: err.message || err}))
}

exports.addTeacher = (req, res) => {
    const {username, name, email, vnuEmail, phone, address, website, degree, position, department} = {...req.body}

    getTeachersActions.addTeacher({username, name, email, vnuEmail, phone, address, website, degree, position, department})
        .then(data => res.send({success: true, data}))
        .catch(err => res.send({success: false, message: err.message || err}))
}

exports.editTeacher = (req, res) => {
    const {id, name, email, vnuEmail, phone, address, website, degree, position, department} = {...req.body, ...req.params}

    getTeachersActions.editTeacher({id, name, email, vnuEmail, phone, address, website, degree, position, department})
        .then(teacher => res.send({success: true, teacher}))
        .catch(err => res.send({success: false, message: err.message || err}))
}

exports.deleteTeacher = (req, res) => {
    const {id} = {...req.params}

    getTeachersActions.deleteTeacher(id)
        .then(teacher => res.send({success: true, teacher}))
        .catch(err => res.send({success: false, message: err.message || err}))
}
