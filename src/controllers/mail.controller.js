const { SECRET_KEY } = require('../config/enviroment.config.js')
const { gmailTransport } = require('../config/tranports.config.js')
const { generateRecoveringToken, cookieExtractor } = require('../utils/session.utils.js')
const jwt = require("jsonwebtoken")

class MailController {

    static async sendEmail(req, res, next) {
        const userEmail = req.body.email
        const fullUrl = `${req.protocol}://${req.get('host')}/newpasswordform`
        const token = generateRecoveringToken(userEmail)
        try {
            let mailInfo = await gmailTransport.sendMail({
                from: 'E-commerce <agustinnasi49@gmail.com',
                to: userEmail,
                subject: 'Password recovering',
                html: `
                <div>
                    <h1>Password recovering</h1>
                    <p>Enter the next link to restore your password</p>
                    <a href=${fullUrl + '?token=' + token} >Recovering link</a>
                    <p>ignore this email if you didn't send it</p>
                </div>`,
                attachments: []
            })
            req.logger.info('email sent => ' + JSON.stringify(mailInfo))
            return res.redirect('/login')
        } catch (error) {
            next(error)
        }
    }
}

module.exports = MailController