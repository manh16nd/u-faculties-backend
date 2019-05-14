const {Fields} = require('../../models')
const {validateQueryArgs} = require('../../helpers/validators/getQueryValidators')
const {isString, isObjectId, removeRedundant} = require('../../helpers/validators/typeValidators')

const _validateArgs = ({limit, page, name}) => {
    const paging = validateQueryArgs({limit, page})
    const parsedName = isString(name)

    return {
        ...paging,
        name: parsedName || '',
    }
}

const _validateFieldArgs = (args) => {
    const name = isString(args.name)
    const parent = isObjectId(args.parent)
    const id = isString(args.id)
    return removeRedundant({id, name, parent})
}

exports.getFields = async ({limit, page, name}) => {
    const validatedArgs = _validateArgs({limit, page, name})
    const query = {
        name: {$regex: new RegExp(`${validatedArgs.name.toLowerCase()}`, 'i')}
    }
    const skip = validatedArgs.limit * (validatedArgs.page - 1)

    const fieldsQuery = Fields
        .find(query)
        .skip(skip)
        .limit(validatedArgs.limit)
        .lean()
    const totalQuery = Fields.countDocuments({})
    const [fields, total] = await Promise.all([fieldsQuery, totalQuery])

    return {
        page: validatedArgs.page,
        fields,
        total,
    }
}

exports.addField = async (args) => {
    const validatedArgs = _validateFieldArgs(args)
    const field = new Fields(validatedArgs)
    return await field.save()
}

exports.editField = async (args) => {
    const validatedArgs = _validateFieldArgs(args)
    const {id, ...fieldDetails} = validatedArgs
    const field = await Fields.findOne({
        _id: id
    }).select('_id')
    if(!field) throw new Error('Field not found')

    for (let key in fieldDetails) field[key] = fieldDetails[key]
    return await field.save()
}

exports.deleteField = async (id) => {
    const ID = isString(id)
    const field = await Fields.findOne({
        _id: ID
    }).select('_id')
    if(!field) throw new Error('Field not found')
    return await field.delete()
}
