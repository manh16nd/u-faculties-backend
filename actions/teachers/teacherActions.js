const { Teachers, Departments, Fields, Users, Topics } = require('../../models')
const { validateQueryArgs } = require('../../helpers/validators/getQueryValidators')
const { sendMail } = require('../../helpers/mail')
const { convertMdToHtml } = require('../../helpers/markdown')
const { signJwt } = require('../../helpers/bcrypt')
const { isString, removeRedundant, isObjectId, isArray } = require('../../helpers/validators/typeValidators')
const { uploadImgur } = require('../../helpers/imgur')
const { parseExcel } = require('../../helpers/excel')

const _validateArgs = (args) => {
    const { page, limit } = validateQueryArgs(args)
    const name = isString(args.name)
    const email = isString(args.email)
    const vnuEmail = isString(args.vnuEmail)
    const phone = isString(args.phone)
    const address = isString(args.address)
    const website = isString(args.website)
    const degree = isString(args.degree)
    const position = isString(args.position)
    const id = isObjectId(args.id)
    const fields = isArray(args.fields)
    const department = isObjectId(args.department)
    const topics = isObjectId(args.topics)
    return removeRedundant({ id, page, topics, address, department, limit, name, email, vnuEmail, phone, website, degree, position, fields })
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
    const field = isObjectId(args.field)

    console.log(username, name, email)
    // if (!username || !name || !email) throw new Error('Missing params')
    return removeRedundant({ username, address, department: args.department, name, email, vnuEmail, phone, website, degree, position, field })
}

exports.getOneTeacher = async (_id) => {
    if (!_id) return null
    console.log("id: " + _id)
    return await Teachers
        .findOne({
            _id
        })
        .select('name email vnuEmail phone address department website degree position field avatar')
        .populate({
            path: 'department',
            model: Departments,
            select: '_id name'
        })
        .populate({
            path: 'fields',
            model: Fields,
            select: '_id name'
        })
        .populate({
            path: 'topics',
            model: Topics,
            select: '_id name'
        })
        .lean()
}

exports.getTeacherByUser = async (user) => {
    if (!user) return null

    return await Teachers.findOne({
        user
    })
        .select('name email vnuEmail phone address department website degree position field topics avatar')
}

exports.getTeachers = async (args) => {
    const validatedArgs = _validateArgs(args)
    const { limit, page, ...query } = validatedArgs
    console.log("TCL: exports.getTeachers -> validatedArgs", validatedArgs)

    const getQuery = {
        name: { $regex: new RegExp(`${(query['name'] || '').toLowerCase()}`, 'i') },
        ...{ ...query.department && { department: query.department } },
        ...{
            ...query.topics && {
                topics: {
                    $elemMatch: { $eq: query.topics }
                }
            }
        }
    }
    const skip = (page - 1) * limit

    const teacherQuery = Teachers
        .find(getQuery)
        .skip(skip)
        .limit(limit)
        .populate({
            path: 'topics',
            model: Topics,
            select: '_id name'
        })
        .populate({
            path: 'fields',
            model: Fields,
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

const addTeacher = async (args) => {
    const validatedTeacher = _validateNewTeacherArgs(args)

    const existUser = await Users.findOne({
        $or: [
            { username: validatedTeacher.username },
            { email: validatedTeacher.email }
        ]
    })

    if (existUser) throw new Error('Username existed')

    const newUser = new Users({
        username: validatedTeacher.username,
        status: 'inactive',
        type: 'teacher',
        email: validatedTeacher.email
    })
    const user = await newUser.save()

    const newTeacher = new Teachers({ ...validatedTeacher, user: user._id })
    const token = signJwt({
        username: validatedTeacher.username
    })
    const token_link = `http://127.0.0.1:5000/newUser?token=${token}&username=${validatedTeacher.username}`
    const teacher = await newTeacher.save()
    const title = 'u-Faculties registration'
    const body = `##Change your password\n
    Your token: ${token}
    Your username: ${validatedTeacher.username}
    Register link: ${token_link}
    `
    const mail = await sendMail({ receiver: validatedTeacher.email, title, body: convertMdToHtml(body) })

    return { user, teacher, mail }
}

exports.addTeacher = addTeacher

exports.editTeacher = async (args) => {
    const validatedArgs = _validateArgs(args)
    const { id, ...teacherDetails } = validatedArgs
    const teacher = await Teachers.findOne({
        _id: id
    }).select('_id')
    if (!teacher) throw new Error('Teacher not found')
    for (let key in teacherDetails) teacher[key] = teacherDetails[key]

    //add teacher id to field
    // const field = await Fields.find({
    //     _id: { $in: args.field }
    // }).select('_id')

    // field.teacher.append(id)
    return await teacher.save()
}

exports.deleteTeacher = async ({ id }) => {
    const ID = isObjectId(id)
    const teacher = await Teachers.findOne({
        _id: ID
    }).select('_id user')
    const user = await Users.findOne({
        _id: teacher.user
    })
    console.log('user', user)
    if (!teacher) throw new Error('Teacher not found')
    return await Promise.all([teacher.delete(), user.delete()])
}

exports.uploadAvatar = async (file, _id) => {
    const teacher = await Teachers.findOne({
        _id,
    })
    if (!teacher) throw new Error('Teacher not found')

    teacher.avatar = await uploadImgur(file.path)
    return await teacher.save()
}

exports.importExcel = async (file) => {
    const data = await parseExcel(file)
    data.forEach(function (x) {
        addTeacher({
            name: x['Họ và tên'],
            username: x['Tên đăng nhập'],
            email: x['VNU email'],
            vnuEmail: x['VNU email'],
        })
    })
}
