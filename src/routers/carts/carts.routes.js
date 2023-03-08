const { Router } = require('express')
const CartsController = require('../../controllers/carts.controller')

const router = Router()

router.get('/', CartsController.getAll)
router.get('/:cid', CartsController.getById)
router.post('/', CartsController.addCart)
router.post('/:cid/product/:pid', CartsController.addProduct)
router.put('/:cid', CartsController.updateProducts)
router.put('/:cid/product/:pid', CartsController.updateQuantity)
router.delete('/:cid/product/:pid', CartsController.removeProducts)
router.delete('/:cid', CartsController.clearCart)

module.exports = router