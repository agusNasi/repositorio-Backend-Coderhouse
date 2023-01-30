const { Router } = require('express');
const productsRoutes = require('./products/products.routes');
const cartsRouter = require('./carts/carts.routes');
const chatRoutes = require('./views/chat.router');

const router = Router();

router.use('/products', productsRoutes);
router.use('/carts', cartsRouter);
router.use('/chat', chatRoutes);


module.exports = router;