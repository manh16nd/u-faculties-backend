const { verifyHeaders } = require('../helpers/bcrypt')
const { Users, Tokens, Teachers } = require('../models')

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
                    return resolve(user)
                })
                .catch(err => reject('Invalid'))
        })
        .catch(err => reject(err.message || err))
})

const getTeacherByUser = (user) => new Promise((resolve, reject) => {
    return Teachers.findOne({
        user,
    })
        .then(teacher => resolve(teacher))
        .catch(err => reject(err.message || err))
})

exports.isAdmin = (req, res, next) => {
    const { authorization } = { ...req.headers }
    if (!authorization) return res.status(403).send({ success: 'false', message: 'Permission denied' })
    try {
        const user = verifyHeaders(authorization)
        getUserInfo(user)
            .then(success => {
                if (user.type !== 'admin' || user.type !== 'staff') return res.status(403).send({ success: 'false', message: 'Permission denied' })

                req.body.currentUser = user
                next()
            })
            .catch(err => {
                console.log(err)
                return res.status(403).send({ success: 'false', message: 'Permission denied' })
            })
    } catch (e) {
        return res.status(403).send({ success: 'false', message: 'Permission denied' })
    }
}

exports.isTeacher = (req, res, next) => {
    const { authorization, id } = { ...req.headers, ...req.params }
    if (!authorization) return res.status(403).send({ success: 'false', message: 'Permission denied' })

    try {
        const user = verifyHeaders(authorization)
        getUserInfo(user)
            .then(async (foundUser) => {
                const { type } = user
                if (type === 'admin' || type === 'staff') {
                    req.body.currentUser = foundUser
                    return next()
                }
                if (type === 'teacher') {
                    if (id) {
                        const teacher = await getTeacherByUser(foundUser._id)

                        if (teacher._id.toString() !== id) return res.status(403).send({ success: 'false', message: 'Permission denied' })
                        req.body.currentUser = foundUser
                        return next()
                    }
                    req.body.currentUser = foundUser
                    return next()
                }
                return res.status(403).send({ success: 'false', message: 'Permission denied' })
            })
            .catch(err => {
                console.log(err)
                return res.status(403).send({ success: 'false', message: 'Permission denied' })
            })
    } catch (e) {
        return res.status(403)
    }
}

exports.verifyUser = (req, res, next) => {
    const { authorization } = { ...req.headers }
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
                return res.status(403).send({ success: 'false', message: 'Permission denied' })
            })
    } catch (e) {
        return res.status(403).send({ success: 'false', message: 'Permission denied' })
    }
}

exports.parseUser = (req, res, next) => {
    const { authorization } = { ...req.headers }
    req.body.currentUser = {}
    if (!authorization) return next()
    try {
        req.body.currentUser = verifyHeaders(authorization)
        next()
    } catch (e) {
        next()
    }
}
