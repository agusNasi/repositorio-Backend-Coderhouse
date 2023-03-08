const { Router } = require('express')
const uploader = require('../../utils/multer.utils')
const ProductsController = require('../../controllers/products.controller')

const router = Router()

router.get('/', ProductsController.getAll)
router.get('/:pid', ProductsController.getById)
router.post('/', uploader.array('files'), ProductsController.addProduct)
router.put('/:pid', ProductsController.updateProduct)
router.delete('/:pid', ProductsController.deleteProduct)

module.exports = router