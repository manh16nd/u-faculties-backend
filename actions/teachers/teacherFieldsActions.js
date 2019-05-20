const {Teachers, Fields, TeacherFields} = require('../../models')
const {isObjectId} = require('../../helpers/validators/typeValidators')

const _validateFields = (fields, userFields) => {
    return fields.filter((field) => isObjectId(field) && !userFields.includes(field))
}

const _validateRemoveFields = (fields, userFields) => {
    return fields.filter((field) => isObjectId(field) && userFields.includes(field))
}

const _addTeacherToField = async (fieldId, teacher) => {
    const field = await Fields.findOne({
        _id: fieldId
    }).select('_id teachers')

    if (!field) return null
    if (field.teachers.includes(teacher._id)) return null

    field.teachers = [...field.teachers, teacher._id]
    teacher.fields = [...teacher.fields, field._id]
    const teacherField = new TeacherFields({
        teacher: teacher._id,
        field: field._id,
    })

    return await Promise.all([
        teacher.save(),
        field.save(),
        teacherField.save(),
    ])
}

const _removeTeacherFromField = async (fieldId, teacher) => {
    const field = await Fields.findOne({
        _id: fieldId
    }).select('_id teachers')

    if (!field) return null
    if (!field.teachers.includes(teacher._id)) return null

    field.teachers = field.teachers.filter((item) => item.toString() !== teacher._id.toString())
    teacher.fields = teacher.fields.filter((item) => item.toString() !== field._id.toString())
    const teacherField = await TeacherFields.findOne({
        teacher: teacher._id,
        field: field._id,
    })

    return await Promise.all([
        teacher.save(),
        field.save(),
        teacherField ? teacherField.delete() : null,
    ])
}

exports.addTeacherToFields = async ({teacherId, fields}) => {
    const teacher = await Teachers.findOne({
        _id: teacherId
    }).select('_id fields')
    if (!teacher) throw new Error('Teacher not found')

    const validFields = _validateFields(fields, teacher.fields)
    const work = validFields.map((field) => {
        return _addTeacherToField(field, teacher)
    })

    return await Promise.all(work)
}

exports.removeTeacherFromFields = async ({teacherId, fields}) => {
    const teacher = await Teachers.findOne({
        _id: teacherId
    }).select('_id fields')
    if (!teacher) throw new Error('Teacher not found')
    const validFields = _validateRemoveFields(fields, teacher.fields)
    const work = validFields.map((field) => {
        return _removeTeacherFromField(field, teacher)
    })

    return await Promise.all(work)
}
