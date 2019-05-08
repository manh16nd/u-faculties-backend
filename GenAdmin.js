const [nodeCommand, fileName, username, password] = process.argv
const {hashText} = require('./helpers/bcrypt')
const {Users} = require('./models')

const mongoose = require('mongoose')
mongoose.set('debug', true)
mongoose.connect('mongodb://webappdev:k61ca2@ds237196.mlab.com:37196/u-faculties', {useNewUrlParser: true})
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))

const hash = hashText(password)
const user = new Users({
    username,
    password: hash,
    type: 'admin'
})

user.save().then(ok => console.log(ok)).catch(err => console.log(err))
