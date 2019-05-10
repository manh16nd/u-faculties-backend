const getTeachersActions = require('../actions/teachers/teacherActions')
const {verifyHeaders} = require('../helpers/bcrypt')

exports.getTeachers = (req, res) => {
    const {limit, page, name, email, vnuEmail, phone, address, website, degree, position} = {...req.query}

    getTeachersActions.getTeachers({limit, page, name, email, vnuEmail, phone, address, website, degree, position})
        .then(data => res.send({success: true, data}))
        .catch(err => res.send({success: false, message: err.message || err}))
}

exports.addTeacher = (req, res) => {
    const {name, email, vnuEmail, phone, address, website, degree, position, department} = {...req.body}

    getTeachersActions.addTeacher({name, email, vnuEmail, phone, address, website, degree, position, department})
        .then(data => res.send({success: true, data}))
        .catch(err => res.send({success: false, message: err.message || err}))
}
