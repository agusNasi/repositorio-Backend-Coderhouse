const ProductMongoDao = require('../models/daos/mongo/ProductMongoDao')
const CartMongoDao = require('../models/daos/mongo/CartMongoDao')
const ChatMongoDao = require('../models/daos/mongo/ChatMongoDao')

const productsMongoDao = new ProductMongoDao()
const cartMongoDao = new CartMongoDao()
const chatMongoDao = new ChatMongoDao()

class ViewsController{

    static async register(req, res, next) {
        res.render('register', {
            title: 'Sign Up!',
            styles: 'register.css'
        })
    }

    static async login(req, res, next) {
        res.render('login', {
            title: 'Login',
            styles: 'login.css'
        })
    }

    static async products(req, res, next) {
        const user = req.user
        try {
            const products = await productsMongoDao.getAll(req.query)
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

    static async cart(req, res, next) {
        const cartId = req.params.cid 
        const user = req.user
        try {
            const cart = await cartMongoDao.getById(cartId)
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

    static async chat(req, res, next) {
        const messages = await chatMongoDao.getAll()
        res.render('chat', {
            title: "Super Chat!",
            styles:"chat.css",
            messages})
    }
}

module.exports = ViewsController