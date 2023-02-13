const { Router } = require('express');
const ProductMongoManager = require('../../daos/mongoManager/product.manager');
const CartMongoManager = require('../../daos/mongoManager/carts.manager');
const { sessionMiddleware } = require('../../middleware/session.middleware');
const { authMiddleware } = require('../../middleware/auth.middleware');
const productService = new ProductMongoManager();
const cartService = new CartMongoManager();


const router = Router()

router.get('/', sessionMiddleware, (req, res)=>{
    res.redirect('/login')
})

router.get('/register', sessionMiddleware, (req, res)=>{
    res.render('register', {
        title: 'Sing Up!',
        style: 'register.css'
    })
})

router.get('/login', sessionMiddleware, (req, res)=>{
    res.render('login', {
        title: 'Login',
        style: 'login.css'
    })
})

router.get('/products', authMiddleware, async (req, res) => {
    try {
        const user = req.session.user;
        const products = await productService.getProducts(req.query)
        res.render("index", {
            style: "index.css",
            title: "E-commerce",
            products: products.docs,
            user: user
        });
    } catch (error) {
        res.status(500).send({
            status: "error",
            error: error.message
        })
    }
})

router.get('/cart/:cid', async (req, res) => {
    const cartId = req.params.cid 
    try {
        const cart = await cartService.getCartById(cartId)
        res.render("cart", {
            style: "cart.css",
            title: "Cart",
            products: cart.products,
            cartId: cart._id
        })
    } catch (error) {
        res.status(500).send({
            status: "error",
            error: error.message
        })
    }
});





module.exports = router