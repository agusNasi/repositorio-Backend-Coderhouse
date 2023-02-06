const { Router } = require('express');
const ProductMongoManager = require('../../daos/mongoManager/product.manager');
const CartMongoManager = require('../../daos/mongoManager/carts.manager');
const productService = new ProductMongoManager();
const cartService = new CartMongoManager();


const router = Router()


router.get('/products', async (req, res) => {
    try {
        const products = await productService.getProducts(req.query)
        res.render("index", {
            style: "index.css",
            title: "E-commerce",
            products: products.docs
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