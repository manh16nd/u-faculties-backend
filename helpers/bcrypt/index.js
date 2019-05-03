const bcrypt = require('bcrypt')
const saltRounds = 10

exports.hashText = (text) => {
    return bcrypt.hash(text, saltRounds)
}
