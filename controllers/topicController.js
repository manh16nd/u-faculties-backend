const getTopicActions = require('../actions/topics/topicActions')

exports.getTopics = (req, res) => {
    const {limit, page, name} = {...req.body, ...req.body}
    getTopicActions.getFields({limit, page, name})
        .then(data => res.send({
            success: true,
            data
        }))
        .catch(err => res.send({
            success: false,
            message: err.message || err
        }))
}

exports.addTopics = (req, res) => {
    const {name, description} = {...req.body}
    getTopicActions.addTopics({name, description})
        .then(data => res.send({
            success: true,
            data
        }))
        .catch(err => res.send({
            success: false,
            message: err.message || err
        }))
}

exports.editTopics = (req, res) => {
    const {id, name, description} = {...req.body, ...req.params}
    getTopicActions.editTopics({id, name, description})
        .then(data => res.send({
            success: true,
            data
        }))
        .catch(err => res.send({
            success: false,
            message: err.message || err
        }))
}

exports.deleteTopic = (req, res) => {
    const {id} = {...req.params}
    getTopicActions.deleteTopic(id)
        .then(data => res.send({
            success: true,
            data
        }))
        .catch(err => res.send({
            success: false,
            message: err.message || err
        }))
}
