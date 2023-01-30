const { Router } = require('express');
const CartMongoManager = require('../../daos/mongoManager/carts.manager');
const productService = new CartMongoManager();

const router = Router();

router.get('/',async (req, res) =>{
    try {
        const cart = await productService.getCarts();
        res.send({
            status: 'success',
            carts: cart
        })
    } catch (error) {
        res.status(500).send({
            status: "error",
            error: error.message
        })
    }
})

router.post('/', async (req, res) => {

    const addCart = await productService.addCart();

    res.send({
        status: 'successfully',
        payload: addCart
    });
})

router.get('/:cid', async(req, res) => {
    const id = req.params.cid
    try {
        const cart = await productService.getCartById(id) 
        res.send({
            status: 'success',
            cart: cart
        })  
    } catch (error) {
        res.status(500).send({
            status: "error",
            error: error.message
        })
    }

})

router.post('/:cid/product/:pid', async(req,res)=>{
    try {
        const cartId = req.params.cid
        const productId = req.params.pid
        const addProduct = await productService.addProduct(cartId, productId)
        res.send({
            status: 'success',
            newCart: addProduct
        })
    } catch (error) {
        res.status(500).send({
            status: "error",
            error: error.message
        })
    }
});



module.exports = router;



