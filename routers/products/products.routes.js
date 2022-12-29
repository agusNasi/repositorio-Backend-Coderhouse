const { Router } = require('express');
const ProductManager = require('../../script');
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

router.post('/', (req, res) => {
    const productManager = async () => {
        let consulta = req.body;
        let addProduct = await products.addProducts(consulta);

        res.send({
            status: 'successfully',
            payload: addProduct
        });
    }


    productManager();
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