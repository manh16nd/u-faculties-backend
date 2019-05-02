const loginActions = require('../actions/auth/login')

exports.login = (req, res) => {
    const {username, password} = {...req.body}

    loginActions.login(username, password)
        .then(data => res.send({
            success: true,
            data,
        }))
        .catch(message => res.send({
            success: false,
            message
        }))
}
