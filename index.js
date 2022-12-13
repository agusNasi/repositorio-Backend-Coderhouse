const ProductManager = require('./script');

const products = new ProductManager('./data/products.json');

const productManager = async () => {
    try {
        //primera consulta
        let firstProduct = await products.getProducts();
        console.log(firstProduct);

        //primer producto
        const newProduct1 = {
            title: "yerba",
            description: "infusion",
            price: 300,
            thumbnail: 'url',
            code: 'gh5k98',
            stock: 5
        }
        const product1Result = await products.addProducts(newProduct1);
        console.log(product1Result);

        //segunda consulta
        firstProduct = await products.getProducts();
        console.log(firstProduct);

        //segundo producto
        const newProduct2 = {
            title: "azucar",
            description: "alimento",
            price: 500,
            thumbnail: 'url',
            code: 'htrh34',
            stock: 5
        }
        const product2Result = await products.addProducts(newProduct2);
        console.log(product2Result);

        //tercer consulta
        firstProduct = await products.getProducts();
        console.log(firstProduct);

        const update = await products.updateProduct(2, {description: 'comida'})


    } catch (error) {
        console.log(error.message);
    }
}

productManager();