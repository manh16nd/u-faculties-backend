const {Users} = require('../../models')

exports.login = async (username, password) => {
    try {
        const user = await Users.findOne({
            username,
            password
        })
            .select('_id username password')
            .lean()

        return user
    } catch (e) {
        console.log(e.message || e)
    }
}

