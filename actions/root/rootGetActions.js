const models = require('../../models')

exports.getHome = async () => {
    const {Authors} = models

    const authors = await Authors
        .find({})
        .select('_id name')
        .lean()

    return authors
}

exports.changeAuthors = async ({_id, name, student_code}) => {
    const {Authors} = models

    const authors = await Authors.findOne({
        _id,
    }).lean()

    if (authors) {
        const result = await Authors.updateOne({
            _id,
        }, {
            name,
            student_code,
        })

        return result
    }

    throw new Error('Authors not found')
}
