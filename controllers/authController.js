const loginActions = require('../actions/auth/authActions')

exports.login = (req, res) => {
    const {username, password} = {...req.body}

    loginActions.login(username, password)
        .then(data => res.send({
            success: true,
            data,
        }))
        .catch(e => res.send({
            success: false,
            message: e.message || e,
        }))
}

exports.createUser = (req, res) => {
    const {username, password, type} = {...req.body}

    loginActions.addUser(username, password, type)
        .then(data => res.send({
            success: true,
            data,
        }))
        .catch(err => res.send({
            success: false,
            message: err.message || err,
        }))
}
