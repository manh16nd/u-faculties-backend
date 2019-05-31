const { Fields, Teachers } = require('../../models')
const { validateQueryArgs } = require('../../helpers/validators/getQueryValidators')
const { isString, isObjectId, removeRedundant } = require('../../helpers/validators/typeValidators')
const Promise = require('bluebird')

const _validateArgs = ({ limit, page, name }) => {
    const paging = validateQueryArgs({ limit, page })
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
    return removeRedundant({ id, name, parent })
}

const _getChildren = async (field) => {
    const { _id: parent } = field
    const query = { parent }

    const children = await Fields
        .find(query)
        .populate({
            path: 'teachers',
            model: Teachers,
            select: '_id name'
        })
        .lean()

    return await Promise.map(children, async (child) => {
        const grand = await _getChildren(child)
        return {
            ...child,
            children: grand,
        }
    })
}

exports.getFields = async ({ limit, page, name }) => {
    const validatedArgs = _validateArgs({ limit, page, name })
    const query = {
        name: { $regex: new RegExp(`${validatedArgs.name.toLowerCase()}`, 'i') },
        parent: {
            $in: [null, []]
        },
    }
    const skip = validatedArgs.limit * (validatedArgs.page - 1)

    const fieldsQuery = Fields
        .find(query)
        .skip(skip)
        .limit(validatedArgs.limit)
        .populate({
            path: 'teachers',
            model: Teachers,
            select: '_id name'
        })
        .lean()

    const totalQuery = Fields.countDocuments({})
    const [fields, total] = await Promise.all([fieldsQuery, totalQuery])

    const fieldsTotal = await Promise.map(fields, async (field) => {
        const children = await _getChildren(field)

        return {
            ...field,
            children,
        }
    })

    return {
        page: validatedArgs.page,
        fields: fieldsTotal,
        total,
    }
}

exports.getOneField = async (_id) => {
    if (!_id) return null
    return await Fields
        .findOne({
            _id
        })
        .select()
        .populate({
            path: 'teachers',
            model: Teachers,
            select: '_id name'
        })
        .populate({
            path: 'parent',
            model: Fields,
            select: '_id name'
        })
        .lean()
}

exports.addField = async (args) => {
    const validatedArgs = _validateFieldArgs(args)
    const field = new Fields(validatedArgs)
    return await field.save()
}

exports.editField = async (args) => {
    const validatedArgs = _validateFieldArgs(args)
    const { id, ...fieldDetails } = validatedArgs
    const field = await Fields.findOne({
        _id: id
    }).select('_id')
    if (!field) throw new Error('Field not found')

    for (let key in fieldDetails) field[key] = fieldDetails[key]
    return await field.save()
}

exports.deleteField = async (id) => {
    const ID = isString(id)
    const field = await Fields.findOne({
        _id: ID
    }).select('_id')
    if (!field) throw new Error('Field not found')
    return await field.delete()
}

exports.getChildren = async (id) => {
    if (!id) return null
    const ID = isObjectId(id)
    return await Fields
        .find({
            parent: ID
        })
        .select('_id name')
        .lean()
}
