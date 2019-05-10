const {verifyHeaders} = require('../helpers/bcrypt')

exports.isAdmin = (req, res) => {
    const {authorization} = {...req.headers}
    if (!authorization) return res.status(403).send({success: 'false', message: 'Permission denied'})
    try {
        const user = verifyHeaders(authorization)
        if (user.type === 'admin') return true
        return res.status(403).send({success: 'false', message: 'Permission denied'})
    } catch (e) {
        return res.status(403).send({success: 'false', message: 'Permission denied'})
    }
}
