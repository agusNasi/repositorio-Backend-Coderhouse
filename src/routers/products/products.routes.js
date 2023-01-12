const { Router } = require('express');
const uploader = require('../../utils')
const ProductManager = require('../../managers/script');
const products = new ProductManager('./data/products.json');

const router = Router();

router.get('/', (req, res) => {
    const productManager = async () => {
        try {
            //primera consulta
            let firstProduct = await products.getProducts();
            let consulta = req.query.limit;

            if (!consulta || isNaN(consulta)) {
                return res.send(firstProduct)
            } 

            let productFilter = firstProduct.filter(product => product.id <= consulta);

            res.send({products:productFilter})
    
    
        } catch (error) {
            console.log(error);
        }
    }

    productManager();
})

router.get('/:pid', (req, res) => {
    const productManager = async () => {
        try {
            let consulta = req.params.pid;
            let searchProduct = await products.getProductById(+consulta);
            let getProducts = await products.getProducts();


            if (!consulta || isNaN(consulta) || !searchProduct) {
                return res.send(getProducts)
            }

            res.send(searchProduct);
        
    
        } catch (error) {
            console.log(error);
        }
    }

    productManager();

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
    const addProduct = await products.addProducts(newProduct)
    if(addProduct.error){
        return res.status(400).send({
                error: addProduct.error
            })
    }
    res.send({
        status: 'success',
        added: addProduct
    })
})

router.put('/:pid', (req, res) => {
    const productManager = async () => {
        let consulta = req.params.pid;
        let change = req.body
        let update = await products.updateProduct(+consulta, change);

        res.send({
            status: 'successfully',
            payload: update
    
        });
    }


    productManager();
})

router.delete('/:pid', (req, res) => {
    const productManager = async () => {
        let consulta = req.params.pid;
        let deleteProduct = await products.deleteProduct(+consulta);

        res.send({
            status: 'successfully',
            payload: deleteProduct
        })

    }

    productManager();
})



module.exports = router;