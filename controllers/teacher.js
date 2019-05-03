const getTeachersActions = require('../actions/teachers/getTeachers')

exports.getTeachers = (req, res) => {
    const {limit, page, name, email, vnuEmail, phone, address, website, degree, position} = {...req.query}

    getTeachersActions.getTeachers({limit, page, name, email, vnuEmail, phone, address, website, degree, position})
        .then(data => res.send({success: true, data}))
        .catch(message => res.send({success: false, message}))
}

exports.addTeacher = (req, res) => {
    const {name, email, vnuEmail, phone, address, department, website, degree, position} = {...req.body}
    getTeachersActions.addTeacher({name, email, vnuEmail, phone, address, department, website, degree, position})
        .then(teacher => res.send({success: true, teacher}))
        .catch(message => res.send({success: false, message}))
}
// exports.editTeacher = (req, res) => {
//
// }
