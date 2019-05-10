const {Departments} = require('../../models')
const {validateQueryArgs} = require('../../helpers/validators/getQueryValidators')
const {isString, removeRedundant} = require('../../helpers/validators/typeValidators')

const _validateArgs = ({limit, page, name}) => {
    const paging = validateQueryArgs({limit, page})
    const parsedName = isString(name)

    return {
        ...paging,
        name: parsedName || '',
    }
}

const _validateDepartmentArgs = (args) => {
    const name = isString(args.name)
    const type = isString(args.type)
    const address = isString(args.address)
    const phone = isString(args.phone)
    const website = isString(args.website)

    return removeRedundant({name, type, address, phone, website})
}

exports.getDepartments = async ({limit, page, name}) => {
    const validatedArgs = _validateArgs({limit, page, name})
    const query = {
        name: {
            $regex: new RegExp(`${validatedArgs.name.toLowerCase()}`, 'i')
        }
    }
    const skip = validatedArgs.limit * (validatedArgs.page - 1)

    const departmentQuery = Departments
        .find(query)
        .skip(skip)
        .limit(validatedArgs.limit)
        .lean()
    const totalQuery = Departments.countDocuments({})
    const [departments, total] = await Promise.all([departmentQuery, totalQuery])

    return {
        page: validatedArgs.page,
        departments,
        total,
    }

}

exports.addDepartment = async (args) => {
    const validatedArgs = _validateDepartmentArgs(args)
    const department = new Departments(validatedArgs)

    return await department.save()
}

exports.editDepartment = async (args) => {
    const validatedArgs = _validateDepartmentArgs(args)
    const department = new Departments(validatedArgs)

    return await department.updateOne()
}
