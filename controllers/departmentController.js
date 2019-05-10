const getDepartmentsActions = require('../actions/departments/departmentActions')

exports.getDepartments = (req, res) => {
    const {limit, page, name} = {...req.query, ...req.body}
    getDepartmentsActions.getDepartments({limit, page, name})
        .then(data => res.send({
            success: true,
            data,
        }))
        .catch(message => res.send({
            success: false,
            message
        }))
}

exports.addDepartment = (req, res) => {
    const {name, type, address, phone, website} = {...req.body}
    getDepartmentsActions.addDepartment({name, type, address, phone, website})
        .then(department => res.send({success: true, department}))
        .catch(message => res.send({success: false, message}))
}

exports.editDepartment = (req, res) => {
    const {name, type, address, phone, website} = {...req.body}
    getDepartmentsActions.editDepartment({name, type, address, phone, website})
        .then(department => res.send({success: true, department}))
        .catch(message => res.send({success: false, message}))
}
