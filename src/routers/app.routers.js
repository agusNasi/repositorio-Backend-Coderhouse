const { Router } = require('express');
const productsRoutes = require('./products/products.routes');
const cartsRouter = require('./carts/carts.routes');
const chatRoutes = require('./views/chat.router');
const sessionRoutes = require('./views/session.routes');

const router = Router();

router.use('/products', productsRoutes);
router.use('/carts', cartsRouter);
router.use('/chat', chatRoutes);
router.use('/session', sessionRoutes);


module.exports = router;