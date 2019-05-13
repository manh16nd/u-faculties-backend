const {Teachers, Departments, Users} = require('../../models')
const {validateQueryArgs} = require('../../helpers/validators/getQueryValidators')
const {sendMail} = require('../../helpers/mail')
const {convertMdToHtml} = require('../../helpers/markdown')
const {signJwt} = require('../../helpers/bcrypt')
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
    const username = isString(args.username)
    const name = isString(args.name)
    const email = isString(args.email)
    const vnuEmail = isString(args.vnuEmail)
    const phone = isString(args.phone)
    const address = isString(args.address)
    const website = isString(args.website)
    const degree = isString(args.degree)
    const position = isString(args.position)
    const department = isObjectId(args.department)

    if (!username || !name || !email) throw new Error('Missing params')

    return removeRedundant({username, address, department, name, email, vnuEmail, phone, website, degree, position})
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
    const existUser = await Users.findOne({
        username: validatedTeacher.username
    })
    if (existUser) throw new Error('Username existed')

    const newUser = new Users({
        username: validatedTeacher.username,
        status: 'inactive',
        type: 'teacher',
        email: validatedTeacher.email
    })
    const user = await newUser.save()

    const newTeacher = new Teachers({...validatedTeacher, user: user._id})
    const token = signJwt({
        username: validatedTeacher.username
    })
    const teacher = await newTeacher.save()
    const title = 'u-Faculties registration'
    const body = `Your change password token: ${token}`
    const mail = await sendMail({receiver: validatedTeacher.email, title, body: convertMdToHtml(body)})

    return {user, teacher, mail}
}

exports.editTeacher = async (args) => {
    const validatedArgs = _validateNewTeacherArgs(args)
    const {id, ...teacherDetails} = validatedArgs
    const teacher = await Teachers.findOne({
        _id: id
    }).select('_id')
    if (!teacher) throw new Error('Teacher not found')

    for (let key in teacherDetails) teacher[key] = teacherDetails[key]
    return await teacher.save()
}

exports.deleteTeacher = async (id) => {
    const ID = isString(id)
    const teacher = await Teachers.findOne({
        _id: id
    }).select('_id')
    if (!teacher) throw new Error('Teacher not found')
    return await teacher.delete()
}
