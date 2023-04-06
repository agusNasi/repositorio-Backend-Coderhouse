const { Router } = require('express')
const uploader = require('../../utils/multer.utils')
const ProductsController = require('../../controllers/products.controller')
const { adminMiddleware } = require('../../middlewares/role.middleware.js')
const passportCall = require('../../middlewares/passport.middleware.js')

const router = Router()

router.get('/',ProductsController.getAll)
router.get('/:pid', ProductsController.getById)
router.post('/', passportCall('jwt'), adminMiddleware, uploader.array('files'), ProductsController.addProduct)
router.put('/:pid', passportCall('jwt'), adminMiddleware, ProductsController.updateProduct)
router.delete('/:pid', passportCall('jwt'), adminMiddleware, ProductsController.deleteProduct)

module.exports = router