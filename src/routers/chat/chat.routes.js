const { Router } = require('express')
const ChatController = require('../../controllers/chat.controller')

const router = Router()

router.get('/', ChatController.getAll)
router.post('/', ChatController.addMessage)
router.delete('/:mid', ChatController.deleteMessage)
router.delete('/', ChatController.deleteAllMessages)

module.exports = router

