const { Router } = require('express')
const uploader = require('../../utils/multer.utils')
const UsersController = require('../../controllers/users.controller')

const router = Router()

router.get('/', UsersController.getAll)
router.get('/:uid', UsersController.getById)
router.post('/', uploader.single('file'), UsersController.addUser)
router.put('/:uid', UsersController.updateUser)
router.delete('/:uid', UsersController.deleteUser)

module.exports = router