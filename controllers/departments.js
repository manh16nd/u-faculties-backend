const getDepartmentsActions = require('../actions/departments/getActions')

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
