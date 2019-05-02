const express = require('express')
const router = express.Router()
const rootController = require('./controllers/root')

router.get('/', (req, res) => res.send('ok'))

router.post('/', rootController.addAuthor)
router.patch('/', rootController.changeAuthor)
router.delete('/', rootController.removeAuthor)

const teacher = require('./controllers/teacher')
router.get('/teachers', teacher.getTeachers)

const department = require('./controllers/departments')
router.get('/departments', department.getDepartments)

const fields =  require('./controllers/fields')
router.get('/fields', fields.getFields)

const authController = require('./controllers/auth')
router.post('/auth/login', authController.login)

module.exports = router