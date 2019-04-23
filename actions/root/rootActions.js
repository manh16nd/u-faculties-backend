const models = require('../../models')
const typeValidators = require('../../helpers/validators/typeValidators')

const _validateAuthor = (args) => {
    const {name, student_code} = args
    const validatedArgs = {
        name: typeValidators.isString(name),
        student_code: typeValidators.isString(student_code),
    }

    return typeValidators.removeRedundant(validatedArgs)
}

const _validateEditedAuthors = (args) => {
    const {name, student_code, _id} = args
    const validatedArgs = {
        name: typeValidators.isString(name),
        student_code: typeValidators.isString(student_code),
        _id: typeValidators.isObjectId(_id)
    }

    if (!validatedArgs._id) throw new Error('Missing ID')

    return typeValidators.removeRedundant(validatedArgs)
}

exports.getHome = async () => {
    const {Authors} = models

    return await Authors
        .find({})
        .select('_id name student_code')
        .lean()
}

exports.addAuthor = async ({name, student_code}) => {
    const validatedAuthor = _validateAuthor({name, student_code})
    const {Authors} = models

    const author = new Authors(validatedAuthor)

    return await author.save()
}

exports.changeAuthor = async (args) => {
    const validatedAuthors = _validateEditedAuthors(args)
    const {_id, ...authorInfo} = validatedAuthors
    const {Authors} = models

    const author = await Authors
        .findOne({
            _id,
        })
        .select('_id name student_code')
        .lean()

    if (author) {
        const editResult = await Authors.updateOne({
            _id,
        }, {
            $set: authorInfo
        })

        if (editResult.nModified) {
            return {
                ...author,
                ...validatedAuthors,
            }
        }
        return {
            ...author,
        }
    }

    throw new Error('Authors not found')
}

exports.removeAuthor = async (_id) => {
    const {Authors} = models

    const removeResult = await Authors.deleteOne({_id})
    const {deletedCount} = removeResult

    if (deletedCount >= 1) return true
    throw new Error('Can not delete')
}
