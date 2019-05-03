const bcrypt = require('bcrypt')
const saltRounds = 10

exports.hashText = (text) => {
    return bcrypt.hashSync(text, saltRounds)
}

exports.compareHash = (a, b) => {
    return bcrypt.compareSync(a, b)
}
