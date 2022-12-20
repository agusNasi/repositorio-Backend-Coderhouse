const ProductManager = require('./script');

const products = new ProductManager('./data/products.json');

const productManager = async () => {
    try {
        //primera consulta
        let firstProduct = await products.getProducts();
        console.log(firstProduct);


    } catch (error) {
        console.log(error.message);
    }
}

productManager();