const express = require('express')
const router = express.Router()
const auth = require('./middlewares/auth')
const multer = require('multer')
const upload = multer({dest: 'uploads/'})

const rootController = require('./controllers/rootController')

router.get('/', rootController.home)
router.get('/ping', rootController.home)
router.get('/errorExample', rootController.fakeError)

const teacher = require('./controllers/teacherController')
router.get('/teachers', teacher.getTeachers)
router.post('/teachers', auth.isAdmin, teacher.addTeacher)
router.patch('/teacher/:id', teacher.editTeacher)
router.delete('teacher/:id', teacher.deleteTeacher)
router.post('/teachers/:id/avatar', auth.isAdmin, upload.single('avatar'), teacher.uploadAvatar)
router.post('/teachers/:id/fields', auth.isAdmin, teacher.addTeacherToFields)
router.delete('/teachers/:id/fields', auth.isAdmin, teacher.removeTeacherFromFields)

const department = require('./controllers/departmentController')
router.get('/departments', department.getDepartments)
router.post('/departments', department.addDepartment)
router.patch('/departments/:id', department.editDepartment)
router.delete('/departments/:id', department.deleteDepartment)

const fields = require('./controllers/fieldController')
router.get('/fields', fields.getFields)
router.post('/fields', fields.addFields)
router.patch('/fields/:id', fields.editFields)
router.delete('/fields/:id', fields.deleteField)

const authController = require('./controllers/authController')
router.post('/auth/login', authController.login)
router.post('/auth/verify', auth.verifyUser, authController.verify)
router.post('/auth/changePassword', auth.parseUser, authController.changePassword)
router.post('/auth/addUser', auth.isAdmin, authController.createUser)
router.delete('/auth/deleteUser/:id', authController.deleteUser)

const topics = require('./controllers/topicController')
router.get('/topics', topics.getTopics)
router.post('/topics', topics.addTopics)
router.patch('/topics/:id', topics.editTopics)
router.delete('/topics/:id', topics.deleteTopic)

module.exports = router
