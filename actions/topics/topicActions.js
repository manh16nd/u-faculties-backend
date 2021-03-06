const {Topics, Teachers} = require('../../models')
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

exports.getOneTopic = async (_id) => {
    if(!_id) return null
    return await Topics
        .findOne({
            _id
        })
        .select('name description')
        .populate({
            path: 'teachers',
            model: Teachers,
            select: '_id name'
        })
        .lean()
}

exports.getTopics = async ({limit, page, name}) => {
    const validatedArgs = _validateArgs({limit, page, name})
    const query = {
        name: {$regex: new RegExp(`${validatedArgs.name.toLowerCase()}`, 'i')}
    }
    const skip = validatedArgs.limit * (validatedArgs.page - 1)

    const topicsQuery = Topics
        .find(query)
        .skip(skip)
        .limit(validatedArgs.limit)
        .populate({
            path: 'teachers',
            model: Teachers,
            select: '_id name'
        })
        .lean()
    const totalQuery = Topics.countDocuments({})
    const [topics, total] = await Promise.all([topicsQuery, totalQuery])

    return {
        page: validatedArgs.page,
        topics,
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
