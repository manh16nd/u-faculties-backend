const {Users} = require('../../models')
const {createHash, compareHash, signJwt} = require('../../helpers/bcrypt')
const {removeRedundant, isString} = require('../../helpers/validators/typeValidators')

exports.login = async (username, password) => {
    console.log(username, password)
    const user = await Users.findOne({
        username,
    })
        .select('username password type')

    if (!user) throw new Error('User not found')
    if (!compareHash(password, user.password)) throw new Error('Wrong password')

    return {
        username,
        type: user.type,
        token: signJwt({username, type: user.type})
    }
}

exports.changePassword = async ({username, password, oldPassword, currentUser}) => {
    let user = await Users.findOne({username})
    let newPassword = createHash(password);
    if(!user) throw new Error('User not found')
    if (user.password && user.status === 'active') {
        if (compareHash(oldPassword, user.password)) {
            user.password = newPassword
            await user.save()
        } else {
            throw new Error('Wrong password')
        }
    }
    else {
        if(currentUser.username === username){
            user.password = password
            user.status = 'active'
            await user.save()
        } else throw new Error('Wrong token')
    }
    return {
        username,
        type: user.type,
        token: signJwt({username, type:user.type})}
}

const _validateArgs = (username, password, type) => {
    const validUsername = isString(username)
    const validPassword = isString(password)
    const validType = isString(type)
    console.log("username: " + validUsername + " password: " + validPassword + " type: " + validType)
    return removeRedundant({username: validUsername, password: validPassword, type: validType})
}

exports.addUser = async (username, password, type) => {
    const hash = createHash(password)
    const validatedArgs = _validateArgs(username, hash, type)
    const user = new Users(validatedArgs)
    return await user.save()
}

exports.deleteUser = async (id) => {
    const ID = isString(id)
    const user = await Users.findOne({
        _id: ID
    }).select('_id')
    if(!user) throw new Error('User not found')
    return await user.delete()
}

