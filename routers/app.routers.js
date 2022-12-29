const { Router } = require('express');
const productsRoutes = require('./products/products.routes');
const cartsRouter = require('./carts/carts.routes');

const router = Router();

router.use('/products', productsRoutes);
router.use('/carts', cartsRouter);



module.exports = router;