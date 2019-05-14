const getTeachersActions = require('../actions/teachers/teacherActions')
const {verifyHeaders} = require('../helpers/bcrypt')

exports.getTeachers = (req, res) => {
    const {limit, page, name, email, vnuEmail, phone, address, website, degree, position} = {...req.query}

    getTeachersActions.getTeachers({limit, page, name, email, vnuEmail, phone, address, website, degree, position})
        .then(data => res.send({success: true, data}))
        .catch(err => res.send({success: false, message: err.message || err}))
}

exports.addTeacher = (req, res) => {
    const {name, email, vnuEmail, phone, address, website, degree, position, department, field} = {...req.body}

    getTeachersActions.addTeacher({name, email, vnuEmail, phone, address, website, degree, position, department, field})
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

    getTeachersActions.editTeacher({id})
        .then(teacher => res.send({success: true, teacher}))
        .catch(err => res.send({success: false, message: err.message || err}))
}
