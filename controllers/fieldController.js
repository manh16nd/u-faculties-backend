const getFieldsActions = require('../actions/fields/fieldsActions')

exports.getFields = (req, res) => {
    const {limit, page, name} = {...req.query, ...req.body}
    getFieldsActions.getFields({limit, page, name})
        .then(data => res.send({
            success: true,
            data
        }))
        .catch(err => res.send({success: false, message: err.message || err}))
}

exports.addFields = (req, res) => {
    const {name, parent} = {...req.body}
    getFieldsActions.addField({name, parent})
        .then(field => res.send({
            success: true,
            field
        }))
        .catch(err => res.send({success: false, message: err.message || err}))
}

exports.editFields = (req, res) => {
    const {id, name, parent} = {...req.body, ...req.params}
    getFieldsActions.editField({id, name, parent})
        .then(field => res.send({
            success: true,
            field
        }))
        .catch(err => res.send({success: false, message: err.message || err}))
}

exports.deleteField = (req, res) => {
    const {id} = {...req.params}
    getFieldsActions.deleteField(id)
        .then(field => res.send({
            success: true,
            field
        }))
        .catch(err => res.send({success: false, message: err.message || err}))
}
