const nodemailer = require('nodemailer')
const { EMAIL, EMAIL_PASSWORD } = require('./enviroment.config')

const gmailTransport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: EMAIL,
        pass: EMAIL_PASSWORD
    }
})


module.exports = {
    gmailTransport
}