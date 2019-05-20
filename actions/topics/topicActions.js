const {Topics} = require('../../models')
const {validateQueryArgs} = require('../../helpers/validators/getQueryValidators')
const {isString, removeRedundant} = require('../../helpers/validators/typeValidators')

const _validateArgs = ({limit, page, name}) => {
    const paging = validateQueryArgs({limit, page})
    const parsedName = isString(name)
    return {
        ...paging,
        name: parsedName || ''
    }
}

const _validateTopicArgs = (args) => {
    const id = isString(args.id)
    const name = isString(args.name)
    const description = isString(args.description)
    return removeRedundant({id, name, description})
}

exports.getFields = async ({limit, page, name}) => {
    const validatedArgs = _validateArgs({limit, page, name})
    const query = {
        name: {$regex: new RegExp(`${validatedArgs.name.toLowerCase()}`, 'i')}
    }
    const skip = validatedArgs.limit * (validatedArgs.page - 1)

    const topicsQuery = Topics
        .find(query)
        .skip(skip)
        .limit(validatedArgs.limit)
        .lean()
    const totalQuery = Topics.countDocuments({})
    const [fields, total] = await Promise.all([topicsQuery, totalQuery])

    return {
        page: validatedArgs.page,
        fields,
        total,
    }
}

exports.addTopics = async (args) => {
    const validatedArgs = _validateTopicArgs(args)
    const topic = new Topics(validatedArgs)
    return await topic.save()
}

exports.editTopics = async (args) => {
    const validatedArgs = _validateTopicArgs(args)
    const {id, ...topicDetails} = validatedArgs
    const topic = await Topics.findOne({
        _id: id
    }).select('_id')
    if(!topic) throw new Error('Topic not found')

    for (let key in topicDetails) topic[key] = topicDetails[key]
    return await topic.save()
}

exports.deleteTopic = async (id) => {
    const ID = isString(id)
    const topic = await Topics.findOne({
        _id: ID
    }).select('_id')
    if(!topic) throw new Error('Topic not found')
    return await topic.delete()
}
