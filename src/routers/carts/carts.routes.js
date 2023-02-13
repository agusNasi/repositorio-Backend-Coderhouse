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

router.post('/', async(req, res)=>{
    try {
        const addCart = await productService.addCart()
        res.send({
            status: 'success',
            cart: addCart
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
        const {cid, pid} = req.params
        const amount = +req.body.amount
        const addProduct = await productService.addProductToCart(cid, pid, amount)
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
})

router.put('/:cid', async (req, res) =>{
    const { cid } = req.params
    const newProducts = req.body
    try {
        const updatedCart = await productService.updateProducts(cid, newProducts)
        res.send({
            status: 'success',
            payload: updatedCart
        })
        
    } catch (error) {
        res.status(500).send({
            status: "error",
            error: error.message
        })
    }
})

router.put('/:cid/product/:pid', async(req,res)=>{
    const {cid, pid} = req.params
    const amount = req.body.quantity
    try {
        if(!amount){
            throw new Error('an amount of product must be provided')
        }
        const updateProduct = await productService.addProductToCart(cid, pid, amount)
        res.send({
            status: 'success',
            payload: updateProduct
        })
    } catch (error) {
        res.status(500).send({
            status: "error",
            error: error.message
        })
    }
})

router.delete('/:cid/product/:pid', async(req,res)=>{
    try {
        const {cid, pid} = req.params
        const deletedProduct = await productService.deleteProductFromCart(cid, pid)
        res.send({
            status: 'success',
            newCart: deletedProduct
        })
    } catch (error) {
        res.status(500).send({
            status: "error",
            error: error.message
        })
    }
})

router.delete('/:cid', async(req,res)=>{
    try {
        const { cid }= req.params
        const result = await productService.deleteAllProducts(cid)
        res.send({
            status: 'success',
            payload: result
        })
    } catch (error) {
        res.status(500).send({
            status: "error",
            error: error.message
        })
    }
})



module.exports = router;



