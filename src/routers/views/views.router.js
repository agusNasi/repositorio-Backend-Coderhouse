const { Router } = require('express');
const uploader = require('../../utils');
const ProductMongoManager = require('../../daos/mongoManager/product.manager');
const productService = new ProductMongoManager();


const router = Router()



router.get('/', async (req, res)=>{
    const products = await productService.getProducts();
    const limit = req.query.limit
    if(!limit){
        return res.render('home',{
            products,
            style: 'home.css',
            title: 'Products'
        })
    }
    const limitedProducts = products.slice(0,limit)
    res.render('home',{
        products: limitedProducts,
        style: 'home.css',
        title: 'Products'
    })
})

router.get('/realtimeproducts', async (req, res)=>{
    const products = await productService.getProducts()
    const limit = req.query.limit
    if(!limit){
        return res.render('realTimeProducts',{
            products: products,
            style: 'home.css',
            title: 'Real Time Products'
        })
    }
    const limitedProducts = products.slice(0,limit)
    res.render('realTimeProducts',{
        products: limitedProducts,
        style: 'home.css',
        title: 'Real Time Products'
    })
})

router.post('/realtimeproducts', uploader.array('files'), async (req, res)=>{
    const newProduct = req.body
    const socket = req.app.get('socket')
    if(!newProduct){
        return res.status(400).send({
            error: 'missing product'
        })
    }
    if(req.files){
        const paths = req.files.map(file => {
            return {path: file.path,
             originalName: file.originalname    
            }
        })
        newProduct.thumbnails = paths
    }
    socket.emit('newProduct', newProduct)
    res.send({
        status: 'success'
    })
})

module.exports = router