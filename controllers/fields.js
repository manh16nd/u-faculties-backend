const getDepartmentsActions = require('../actions/fields/getActions')

exports.getFields = (req, res) => {
    const {limit, page, name} = {...req.query, ...req.body}
    getDepartmentsActions.getFields({limit, page, name})
        .then(data => res.send({
            success: true,
            data,
        }))
        .catch(message => res.send({
            success: false,
            message
        }))
}
