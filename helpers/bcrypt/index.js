const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')
const secretKey = 'SHAZAM!'

exports.hashText = (text) => {
    return bcrypt.hashSync(text, saltRounds)
}

exports.compareHash = (a, b) => {
    return bcrypt.compareSync(a, b)
}

exports.signJwt = (sign) => jwt.sign(sign, secretKey)

exports.verifyHeaders = (header) => {
    try {
        const token = header.replace('Bearer ', '')
        return jwt.verify(token, secretKey)
    } catch (e) {
        throw new Error(e.message || e)
    }
}
