const { Router } = require('express')
const CartsController = require('../../controllers/carts.controller')
const passportCall = require('../../middlewares/passport.middleware.js')
const { userMiddleware } = require('../../middlewares/role.middleware.js')

const router = Router()

router.get('/', CartsController.getAll)
router.get('/:cid', CartsController.getById)
router.post('/', CartsController.addCart)
router.put('/:cid/product/:pid', passportCall('jwt'), userMiddleware, CartsController.addProduct)
router.put('/:cid/purchase', passportCall('jwt'), userMiddleware, CartsController.purchase)
router.delete('/:cid/product/:pid', CartsController.removeProduct)
router.delete('/:cid', CartsController.clearCart)

module.exports = router