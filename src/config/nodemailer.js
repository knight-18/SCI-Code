const nodemailer = require('nodemailer')
require('dotenv').config();

//for sending to user
const signUpMail = (data, mailSubject, mailHtml) => {
    const PORT = process.env.PORT || 8080
    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.NODEMAILER_EMAIL, //email id
            pass: process.env.NODEMAILER_PASSWORD, //my gmail password
        },
    })
    var mailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: `${data.businessEmail}`,
        subject: mailSubject,
        html: mailHtml,
    }
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('Error', error)
        } else {
            console.log('Email sent: ' + info.response)
        }
    })
}

module.exports = {
    signUpMail,
}
