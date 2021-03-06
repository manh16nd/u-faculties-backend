const express = require('express')
const router = express.Router()
const auth = require('./middlewares/auth')
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname)
    }
})
const upload = multer({ storage: storage })

const rootController = require('./controllers/rootController')

router.get('/', rootController.home)
router.get('/ping', rootController.home)
router.get('/errorExample', rootController.fakeError)

const teacher = require('./controllers/teacherController')
router.get('/teachers', teacher.getTeachers)
router.get('/teachers/:id', teacher.getOneTeacher)
router.post('/teachers/excel', upload.single("excel"), teacher.importExcel)
router.post('/teachers', auth.isAdmin, teacher.addTeacher)
router.patch('/teachers/:id',  auth.isTeacher, teacher.editTeacher)
router.delete('/teachers/:id', auth.isAdmin,  teacher.deleteTeacher)
router.get('/teachers/:id/fields', auth.isTeacher, teacher.getTeacherFields)
router.get('/teachers/:id/topics', auth.isTeacher, teacher.getTeacherTopics)
router.delete('/teachers/:id/fields', auth.isTeacher, teacher.removeTeacherFromFields)
router.delete('/teachers/:id/topics', auth.isTeacher, teacher.removeTeacherFromTopics)
router.post('/teachers/:id/avatar', auth.isTeacher, upload.single('avatar'), teacher.uploadAvatar)
router.post('/teachers/:id/fields', auth.isTeacher, teacher.addTeacherToFields)
router.post('/teachers/:id/topics', auth.isTeacher, teacher.addTeacherToTopic)

const department = require('./controllers/departmentController')
router.get('/departments', department.getDepartments)
router.post('/departments', department.addDepartment)
router.patch('/departments/:id', department.editDepartment)
router.delete('/departments/:id', department.deleteDepartment)
router.get('/departments/types', department.getDepartmentTypes)

const fields = require('./controllers/fieldController')
router.get('/fields', fields.getFields)
router.get('/fields/all', fields.getAllFields)
router.get('/fields/:id', fields.getOneField)
router.post('/fields', fields.addFields)
router.patch('/fields/:id', fields.editFields)
router.delete('/fields/:id', fields.deleteField)
router.get('/fields/:id/children', fields.getChildren)

const authController = require('./controllers/authController')
router.post('/auth/login', authController.login)
router.get('/auth/verify', auth.verifyUser, authController.verify)
router.get('/auth/teacherInfo', auth.isTeacher, authController.getTeacherInfo)
router.post('/auth/changePassword', auth.parseUser, authController.changePassword)
router.post('/auth/addUser', auth.isAdmin, authController.createUser)
router.delete('/auth/deleteUser/:id', authController.deleteUser)

const topics = require('./controllers/topicController')
router.get('/topics', topics.getTopics)
router.get('/topics/:id', topics.getOneTopic)
router.post('/topics', topics.addTopics)
router.patch('/topics/:id', topics.editTopics)
router.delete('/topics/:id', topics.deleteTopic)

module.exports = router
