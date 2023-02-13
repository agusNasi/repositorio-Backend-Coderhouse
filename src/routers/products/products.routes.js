const { Router } = require('express');
const { uploader } = require('../../utils')
const ProductMongoManager = require('../../daos/mongoManager/product.manager');
const productService = new ProductMongoManager();

const router = Router();

router.get('/', async (req, res)=>{
    try {
        const products = await productService.getProducts(req.query)
        return res.send({
            status: 'success',
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: null,
            nexLink: null})
    } catch (error) {
        res.status(500).send({
            status: "error",
            error: error.message
        })
    }
})

router.get('/:pid', async(req, res) => {
        try {
            const { pid } = req.params;
            const searchProduct = await productService.getProductById(pid);
            const getProducts = await productService.getProducts();


            if (!pid || !searchProduct) {
                return res.send(getProducts)
            }

            res.status(200).json({
                status:"successfully",
                products: searchProduct
            });
        
    
        } catch (error) {
            res.status(400).json({
                status:"ERROR",
                message:error.message
            })
        }

})

router.post('/', uploader.array('files'), async (req, res) =>{
    const newProduct = req.body
    if(req.files){
        const paths = req.files.map(file => {
            return {path: file.path,
             originalName: file.originalname    
            }
        })
        newProduct.thumbnails = paths
    }
    if(!Object.keys(newProduct).length){
        return res.status(400).send('Error: Missing product')
    }
    const addProduct = await productService.addProduct(newProduct)
    if(addProduct.error){
        return res.status(400).send({
                error: addProduct.error
            })
    }
    res.send({
        status: 'successfully',
        added: addProduct
    })
})

router.put('/:pid', async(req, res) => {
    try {
        const { pid } = req.params;
        const change = req.body
        const update = await productService.updateProduct(change, pid);

        res.status(200).json({
            status:"successfully",
            product: update
        })
    } catch (error) {
        res.status(400).json({
            status:"ERROR",
            message:error.message
        })
    }
})

router.delete('/:pid', async (req, res) => {
        try {
            let { pid } = req.params;
            let deleteProduct = await productService.deleteProduct(pid);
    
            res.send({
                status: 'successfully',
                payload: deleteProduct
            }) 
        } catch (error) {
            res.status(400).json({
                status:"ERROR",
                message:error.message
            })
        }

})



module.exports = router;