const getDepartmentsActions = require('../actions/departments/departmentActions')

exports.getDepartments = (req, res) => {
    const {limit, page, name, type} = {...req.query, ...req.body}
    getDepartmentsActions.getDepartments({limit, page, name, type})
        .then(data => res.send({
            success: true,
            data,
        }))
        .catch(err => res.send({success: false, message: err.message || err}))
}

exports.addDepartment = (req, res) => {
    const {name, type, address, phone, website} = {...req.body}
    getDepartmentsActions.addDepartment({name, type, address, phone, website})
        .then(data => res.send({success: true, data}))
        .catch(err => res.send({success: false, message: err.message || err}))
}

exports.editDepartment = (req, res) => {
    const {id, name, type, address, phone, website} = {...req.body, ...req.params}
    getDepartmentsActions.editDepartment({id, name, type, address, phone, website})
        .then(data => res.send({success: true, data}))
        .catch(err => res.send({success: false, message: err.message || err}))
}

exports.deleteDepartment = (req, res) => {
    const {id} = {...req.params}
    getDepartmentsActions.deleteDepartment(id)
        .then(data => res.send({success: true, data}))
        .catch(err => res.send({success: false, message: err.message || err}))
}

exports.getDepartmentTypes = (req, res) => {
    getDepartmentsActions.getDepartmentTypes()
        .then(data => res.send({success: true, data}))
        .catch(err => res.send({success: false, message: err.message || err}))
}
