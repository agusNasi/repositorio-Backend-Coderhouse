const { Router } = require('express')
const messageModel = require('../../models/schemas/message.model')
const productModel = require('../../models/schemas/product.model')
const ProductManagerMongo = require('../../models/daos/mongo/ProductManagerMongo')
const CartManagerMongo = require('../../models/daos/mongo/CartManagerMongo')
const { sessionMiddleware } = require('../../middlewares/session.middleware')
const { authMiddleware } = require('../../middlewares/auth.middleware')
const passportCall = require('../../middlewares/passport.middleware')

const router = Router()

const productMongoService = new ProductManagerMongo()
const cartMongoService = new CartManagerMongo()

router.get('/', (req, res)=>{
    res.redirect('/login')
})

router.get('/register', 
    sessionMiddleware,
    (req, res)=>{
    res.render('register', {
        title: 'Sign Up!',
        styles: 'register.css'
    })
})

router.get('/login', 
    sessionMiddleware,
    (req, res)=>{
        res.render('login', {
            title: 'Login',
            styles: 'login.css'
        })
    }
)

router.get('/products',
    authMiddleware,
    passportCall('jwt'),
    async (req, res) => {
        const user = req.user
        try {
            const products = await productMongoService.getProducts(req.query)
            res.render('index', {
                title: "E-commerce",
                styles:"index.css",
                products: products.docs,
                user: user
            })
        } catch (error) {
            res.status(500).send({
                status: "error",
                error: error.message
            })
        }
    }
)

router.get('/cart/:cid', 
    authMiddleware,
    passportCall('jwt'),
    async (req, res) => {
        const cartId = req.params.cid 
        const user = req.user
        try {
            const cart = await cartMongoService.getCartById(cartId);
            res.render('cart', {
                title: "Cart",
                styles:"cart.css",
                user,
                cart
            })
        } catch (error) {
            res.status(500).send({
                status: "error",
                error: error.message
            })
        }
    }
)

router.get('/chat', 
    authMiddleware,
    passportCall('jwt'),
    async (req,res)=>{
    const messages = await messageModel.find().lean()
    res.render('chat', {
        title: "Super Chat!",
        styles:"chat.css",
        messages})
})

module.exports = router