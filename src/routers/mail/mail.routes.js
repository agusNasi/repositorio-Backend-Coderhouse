const { Router } = require('express')
const MailController = require('../../controllers/mail.controller.js')

const router = Router()

router.post('/', MailController.sendEmail)


module.exports = router