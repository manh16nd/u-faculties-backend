const {verifyHeaders} = require('../helpers/bcrypt')
const {Users, Tokens} = require('../models')

const getUserInfo = (data) => new Promise((resolve, reject) => {
    Users.findOne({
        username: data.username,
        type: data.type,
    })
        .then(user => {
            if (!user) return reject('Invalid')

            Tokens.findOne({
                user: user._id
            })
                .then(token => {
                    if (!token || token.value !== data.value) return reject('invalid')
                    return resolve(data)
                })
                .catch(err => reject('Invalid'))
        })
        .catch(err => reject(err.message || err))
})

exports.isAdmin = (req, res, next) => {
    const {authorization} = {...req.headers}
    if (!authorization) return res.status(403).send({success: 'false', message: 'Permission denied'})
    try {
        const user = verifyHeaders(authorization)
        getUserInfo(user)
            .then(success => {
                if (user.type !== 'admin') return res.status(403).send({success: 'false', message: 'Permission denied'})

                req.body.currentUser = user
                next()
            })
            .catch(err => {
                console.log(err)
                return res.status(403).send({success: 'false', message: 'Permission denied'})
            })
    } catch (e) {
        return res.status(403).send({success: 'false', message: 'Permission denied'})
    }
}

exports.verifyUser = (req, res, next) => {
    const {authorization} = {...req.headers}
    req.body.currentUser = {}
    if (!authorization) return next()
    try {
        const user = verifyHeaders(authorization)
        getUserInfo(user)
            .then(success => {
                console.log(success)
                req.body.currentUser = user
                next()
            })
            .catch(err => {
                console.log(err)
                next()
            })
    } catch (e) {
        console.log(e.message || e)
        next()
    }
}

exports.parseUser = (req, res, next) => {
    const {authorization} = {...req.headers}
    req.body.currentUser = {}
    if (!authorization) return next()
    try {
        req.body.currentUser = verifyHeaders(authorization)
        next()
    } catch (e) {
        next()
    }
}
