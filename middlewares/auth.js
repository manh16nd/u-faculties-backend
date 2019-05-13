const {verifyHeaders} = require('../helpers/bcrypt')

exports.isAdmin = (req, res, next) => {
    const {authorization} = {...req.headers}
    if (!authorization) return res.status(403).send({success: 'false', message: 'Permission denied'})
    try {
        const user = verifyHeaders(authorization)
        if (user.type !== 'admin') return res.status(403).send({success: 'false', message: 'Permission denied'})

        req.body.currentUser = user
        next()
    } catch (e) {
        return res.status(403).send({success: 'false', message: 'Permission denied'})
    }
}

exports.verifyUser = (req, res, next) => {
    const {authorization} = {...req.headers}
    if (!authorization) return res.status(403).send({success: 'false', message: 'Permission denied'})
    try {
        const user = verifyHeaders(authorization)
        req.body.currentUser = user
        next()
    } catch (e) {
        return res.status(403).send({success: 'false', message: 'Permission denied'})
    }

}
