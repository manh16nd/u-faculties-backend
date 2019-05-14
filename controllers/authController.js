const authActions = require('../actions/auth/authActions')

exports.login = (req, res) => {
    const {username, password} = {...req.body}

    authActions.login(username, password)
        .then(data => res.send({
            success: true,
            data,
        }))
        .catch(err => res.send({
            success: false,
            message: err.message || err,
        }))
}

exports.verify = (req, res) => {
    const {currentUser} = {...req.body}
    authActions.verify(currentUser)
        .then(data => res.send({
            success: true,
            data,
        }))
        .catch(err => res.send({
            success: false,
            message: err.message || err,
        }))
}
exports.changePassword = (req, res) => {
    const {username, password, oldPassword, currentUser} = {...req.body}

    authActions.changePassword({username, password, oldPassword, currentUser})
        .then(data => res.send({
            success: true,
            data,
        }))
        .catch(err => res.send({
            success: false,
            message: err.message || err
        }))
}

exports.createUser = (req, res) => {
    const {username, password} = {...req.body}
    const type = 'teacher'
    authActions.addUser(username, password, type)
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
    authActions.deleteUser(id)
        .then(data => res.send({
            success: true,
            data,
        }))
        .catch(err => res.send({
            success: false,
            message: err.message || err,
        }))

}
