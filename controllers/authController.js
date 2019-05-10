const loginActions = require('../actions/auth/authActions')

exports.login = (req, res) => {
    const {username, password} = {...req.body}

    loginActions.login(username, password)
        .then(data => res.send({
            success: true,
            data,
        }))
        .catch(err => res.send({
            success: false,
            message: err.message || err,
        }))
}

exports.createUser = (req, res) => {
    const {username, password} = {...req.body}
    const type = 'teacher'
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

exports.deleteUser = (req, res) => {
    const {id} = {...req.params}
    loginActions.deleteUser(id)
        .then(data => res.send({
            success: true,
            data,
        }))
        .catch(err => res.send({
            success: false,
            message: err.message || err,
        }))

}
