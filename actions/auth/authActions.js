const { Users, Tokens, Teachers } = require('../../models')
const { createHash, compareHash, signJwt } = require('../../helpers/bcrypt')
const { removeRedundant, isString } = require('../../helpers/validators/typeValidators')

exports.login = async (username, password) => {
    const user = await Users.findOne({
        username,
    })
        .select('_id username password type')

    if (!user) throw new Error('User not found')

    if (!compareHash(password, user.password)) throw new Error('Wrong password')

    const token = await Tokens.findOne({ user: user._id })
    const value = (!token || !token.value) ? createHash(new Date().getTime()) : token.value
    if (!token || !token.value) {
        const newToken = new Tokens({ user: user._id, value })
        await newToken.save()
    }

    const teacher = user.type === 'teacher' && await Teachers.findOne({ user: user._id }).select('_id')

    return {
        username,
        type: user.type,
        token: signJwt({ username, type: user.type, value }),
        teacher: teacher._id
    }
}

exports.verify = async (currentUser) => {
    const { username } = currentUser

    const user = await Users.findOne({
        username,
    }).select('_id username type')

    return user
}

exports.changePassword = async ({ username, password, oldPassword, currentUser }) => {
    let user = await Users.findOne({ username })
    let newPassword = createHash(password);
    if (!user) throw new Error('User not found')
    if (user.password && user.status === 'active') {
        if (compareHash(oldPassword, user.password)) {
            user.password = newPassword
            await user.save()
        } else {
            throw new Error('Wrong password')
        }
    } else {
        if (currentUser.username !== username) throw new Error('Wrong token')
        user.password = newPassword
        user.status = 'active'
        await user.save()
    }

    const value = createHash(String(new Date().getTime()))
    const newToken = new Tokens({ user: user._id, value })
    const teacher = user.type === 'teacher' && await Teachers.findOne({ user: user._id }).select('_id')
    await Tokens.deleteMany({ user: user._id })
    await newToken.save()

    return {
        username,
        type: user.type,
        token: signJwt({
            username, type: user.type, value,
            teacher: teacher._id
        })
    }
}

const _validateArgs = (username, password, type) => {
    const validUsername = isString(username)
    const validPassword = isString(password)
    const validType = isString(type)
    
    return removeRedundant({ username: validUsername, password: validPassword, type: validType })
}

exports.addUser = async (username, password, type) => {
    const hash = createHash(password)
    const validatedArgs = _validateArgs(username, hash, type)
    const user = new Users(validatedArgs)
    return (await user.save()).toJSON()
}

exports.deleteUser = async (id) => {
    const ID = isString(id)
    const user = await Users.findOne({
        _id: ID
    }).select('_id')
    if (!user) throw new Error('User not found')
    return await user.delete()
}

