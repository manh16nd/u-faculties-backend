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
router.patch('/departments/:id', department.editDepartment)
router.delete('/departments/:id', department.deleteDepartment)

const fields = require('./controllers/fieldController')
router.get('/fields', fields.getFields)
router.post('/fields', fields.addFields)
router.patch('/fields/:id', fields.editFields)
router.delete('/fields/:id', fields.deleteField)

const authController = require('./controllers/authController')
router.post('/auth/login', authController.login)
router.post('/auth/addUser', authController.createUser)
router.delete('/auth/deleteUser/:id', authController.deleteUser)

module.exports = router
