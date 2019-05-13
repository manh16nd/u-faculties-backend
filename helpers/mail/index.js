const nodemailer = require('nodemailer')
const user = 'uet.ufaculties@gmail.com'
const password = 'k61caclc2'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user,
        pass: password,
    }
})

exports.sendMail = async ({receiver, title, body}) => {
    const mailOptions = {
        from: 'u-Faculties',
        to: receiver,
        subject: title,
        html: body,
    }

    return await transporter.sendMail(mailOptions)
}
