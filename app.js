const ProductManager = require('./script');
const products = new ProductManager('./data/products.json');
const express = require('express');
const app = express();

app.use(express.urlencoded({extended:true}));

app.get('/products', (req,res) => {
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

app.get('/products/:pid', (req, res) => {
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





app.listen(8080,() => console.log('server arriba'));