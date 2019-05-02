const {Fields} = require('../../models')
const {validateQueryArgs} = require('../../helpers/validators/getQueryValidators')
const {isString} = require('../../helpers/validators/typeValidators')

const _validateArgs = ({limit, page, name}) => {
    const paging = validateQueryArgs({limit, page})
    const parsedName = isString(name)

    return {
        ...paging,
        name: parsedName || '',
    }
}

exports.getFields = async ({limit, page, name}) => {
    const validatedArgs = _validateArgs({limit, page, name})
    const query = {
        name: {$regex: validatedArgs.name}
    }
    const skip = validatedArgs.limit * (validatedArgs.page - 1)

    const departmentQuery = Fields
        .find(query)
        .skip(skip)
        .limit(validatedArgs.limit)
        .lean()
    const totalQuery = Fields.countDocuments({})
    const [departments, total] = await Promise.all([departmentQuery, totalQuery])

    return {
        page: validatedArgs.page,
        departments,
        total,
    }

}
