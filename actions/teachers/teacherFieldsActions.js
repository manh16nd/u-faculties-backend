const {Teachers, Fields, TeacherFields} = require('../../models')
const {isObjectId} = require('../../helpers/validators/typeValidators')

const _validateFields = (fields, userFields) => {
    return fields.filter((field) => isObjectId(field) && !userFields.find((item) => item === field))
}

const _addTeacherToField = async (fieldId, teacher) => {
    const field = await Fields.findOne({
        _id: fieldId
    }).select('_id teachers')
    if (!field) return 123
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

exports.addTeacherToFields = async ({teacherId, fields}) => {
    const teacher = await Teachers.findOne({
        _id: teacherId
    }).select('_id fields')
    if (!teacher || teacher.type !== 'teacher') throw new Error('Teacher not found')

    const validFields = _validateFields(fields, teacher.fields)

    const work = validFields.map((field) => {
        return _addTeacherToField(field, teacher)
    })
    const result = await Promise.all(work)

    return result
}

exports.removeTeacherFromFields = async ({teacherId, fields}) => {
    const teacher = await Teachers.findOne({
        _id: teacherId
    }).select('_id fields')
    if (!teacher || teacher.type !== 'teacher') throw new Error('Teacher not found')

    return {
        teacherId,
        fields
    }
}
