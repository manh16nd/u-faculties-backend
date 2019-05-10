const express = require('express')
const router = express.Router()
const rootController = require('./controllers/rootController')

router.get('/', (req, res) => res.send('ok'))

router.post('/', rootController.addAuthor)
router.patch('/', rootController.changeAuthor)
router.delete('/', rootController.removeAuthor)

const teacher = require('./controllers/teacherController')
router.get('/teachers', teacher.getTeachers)
router.post('/teachers', teacher.addTeacher)

const department = require('./controllers/departmentController')
router.get('/departments', department.getDepartments)
router.post('/departments', department.addDepartment)

const fields =  require('./controllers/fieldController')
router.get('/fields', fields.getFields)

const authController = require('./controllers/authController')
router.post('/auth/login', authController.login)
router.post('/auth/addUser', authController.createUser)

module.exports = router
