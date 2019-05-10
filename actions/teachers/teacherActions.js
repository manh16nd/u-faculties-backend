const {Teachers, Departments} = require('../../models')
const {validateQueryArgs} = require('../../helpers/validators/getQueryValidators')
const {isString, removeRedundant, isObjectId} = require('../../helpers/validators/typeValidators')

const _validateArgs = (args) => {
    const {page, limit} = validateQueryArgs(args)
    const name = isString(args.name)
    const email = isString(args.email)
    const vnuEmail = isString(args.vnuEmail)
    const phone = isString(args.phone)
    const address = isString(args.address)
    const website = isString(args.website)
    const degree = isString(args.degree)
    const position = isString(args.position)

    return removeRedundant({page, address, limit, name, email, vnuEmail, phone, website, degree, position})
}

const _validateNewTeacherArgs = (args) => {
    const name = isString(args.name)
    const email = isString(args.email)
    const vnuEmail = isString(args.vnuEmail)
    const phone = isString(args.phone)
    const address = isString(args.address)
    const website = isString(args.website)
    const degree = isString(args.degree)
    const position = isString(args.position)
    const department = isObjectId(args.department)
    console.log(department)

    return removeRedundant({address, department, name, email, vnuEmail, phone, website, degree, position})
}

exports.getTeachers = async (args) => {
    const validatedArgs = _validateArgs(args)
    const {limit, page, ...query} = validatedArgs

    const getQuery = Object.keys(query).reduce((q, key) => ({
        ...q,
        [key]: {$regex: new RegExp(`${query[key].toLowerCase()}`, 'i')}
    }), {})
    const skip = (page - 1) * limit

    const teacherQuery = Teachers
        .find(getQuery)
        .skip(skip)
        .limit(limit)
        .populate({
            path: 'department',
            model: Departments,
            select: '_id name'
        })
        .lean()
    const totalQuery = Teachers.countDocuments({})
    const [teachers, total] = await Promise.all([teacherQuery, totalQuery])

    return {
        total,
        teachers,
        page,
    }
}

exports.addTeacher = async (args) => {
    const validatedTeacher = _validateNewTeacherArgs(args)
    const teacher = new Teachers(validatedTeacher)

    return await teacher.save()
}