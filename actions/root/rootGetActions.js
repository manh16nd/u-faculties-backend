const models = require('../../models')

exports.getHome = async () => {
    const {Authors} = models

    const authors = await Authors
        .find({})
        .select('_id name')
        .lean()

    return authors
}
