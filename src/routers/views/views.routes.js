const { Router } = require('express')
const ViewsController = require('../../controllers/views.controller')
const { sessionMiddleware } = require('../../middlewares/session.middleware')
const { authMiddleware } = require('../../middlewares/auth.middleware')
const passportCall = require('../../middlewares/passport.middleware')

const router = Router()

router.get('/', (req, res)=>{
    res.redirect('/login')
})

router.get('/register', 
    sessionMiddleware,
    ViewsController.register
)

router.get('/login', 
    sessionMiddleware,
    ViewsController.login
)

router.get('/products',
    authMiddleware,
    passportCall('jwt'),
    ViewsController.products
)

router.get('/cart/:cid', 
    authMiddleware,
    passportCall('jwt'),
    ViewsController.cart
)

router.get('/chat', 
    authMiddleware,
    passportCall('jwt'),
    ViewsController.chat
)

router.get('/ticket/:tid',
    authMiddleware,
    passportCall('jwt'),
    ViewsController.ticket
)

module.exports = router