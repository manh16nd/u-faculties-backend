const {Users} = require('../../models')
const {compareHash} = require('../../helpers/bcrypt')

exports.login = async (username, password) => {
    console.log(username, password)
    const user = await Users.findOne({
        username,
    })
        .select('username password type')

    if (!user) throw new Error('User not found')
    if (compareHash(password, user.password)) return user
    throw new Error('Wrong password')
}

