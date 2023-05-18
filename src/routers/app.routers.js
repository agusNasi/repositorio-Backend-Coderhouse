const { Router } = require('express');
const productsRoutes = require('./products/products.routes');
const cartRoutes = require('./carts/carts.routes');
const chatRoutes = require('./chat/chat.routes');
const sessionRoutes = require('./session/session.routes');
const userRoutes = require('./users/users.routes');
const mailRoutes = require('./mail/mail.routes');
const errorMiddleware = require('../middlewares/error.middleware');

const router = Router();

router.use('/products', productsRoutes);
router.use('/carts', cartRoutes);
router.use('/chat', chatRoutes);
router.use('/session', sessionRoutes);
router.use('/users', userRoutes);
router.use('/mail', mailRoutes);

router.use(errorMiddleware);

module.exports = router;
