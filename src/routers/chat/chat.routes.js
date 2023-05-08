const { Router } = require('express')
const ChatController = require('../../controllers/chat.controller')
const { roleMiddleware } = require('../../middlewares/role.middleware.js')
const passportCall = require('../../middlewares/passport.middleware.js')

const router = Router()

router.get('/', ChatController.getAll)
router.post('/', passportCall('jwt'), roleMiddleware(['user']), ChatController.addMessage)
router.delete('/:mid', ChatController.deleteMessage)
router.delete('/', ChatController.deleteAllMessages)

module.exports = router

