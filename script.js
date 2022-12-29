const fs = require('fs/promises');
const { existsSync } = require('fs');



class ProductManager {

    static idCounter = 0;

    constructor(path) {
        this.path = path
    }

    

    async addProducts(product) {
        try {
            const savedProducts = await this.getProducts();
            const DuplicatedProduct = savedProducts.find(item => item.code == product.code)
            if (DuplicatedProduct){
                throw new Error(`ERROR: No se pudo añadir. El siguiente código ya se encuentra registrado: ${product.code}`)
            }
            if (!savedProducts.length) {
                ProductManager.idCounter = 1;
            } else {
                ProductManager.idCounter = savedProducts[savedProducts.length - 1].id + 1;
            }
            
            const newProduct = {
                id: ProductManager.idCounter,
                ...product
            }
            savedProducts.push(newProduct);
            await fs.writeFile(this.path, JSON.stringify(savedProducts, null, '\t'));
            return newProduct;


        } catch (error) {
            console.error(error.message);
        }
    }


    async getProducts() {
        try {
            if (existsSync(this.path)) {
                const data = await fs.readFile(this.path, 'utf-8');
                if (data.length > 0) {
                    const parsedProducts = JSON.parse(data);
                    return parsedProducts;
                } else {
                    return [];
                }
            } else {
                return [];
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    async getProductById(id) {
        try{
            const savedProducts = await this.getProducts();
            const selectedProduct = savedProducts.find(prod => prod.id === id)
            if(!selectedProduct){
                throw new Error('ERROR: ningún producto coincide con la id especificada')
            }
            return selectedProduct
        }
        catch(error){
            console.log(error.message)
        }
    }

    async updateProduct(id, product) {
        try{
            const savedProducts = await this.getProducts()
            const targetProduct = await this.getProductById(id)
            if(targetProduct){
                const updatedProduct = {...targetProduct, ...product}
                const updatedList = savedProducts.map(prod =>{
                    if(prod.id === id){
                        return updatedProduct
                    }else{
                        return prod
                    }
                })
                const productListString = JSON.stringify(updatedList, null, '\t')
                await fs.writeFile(this.path, productListString)
                console.log('producto modificado')
            }
        }
        catch(error){
            console.log(error.message)
        }
    }

    async deleteProduct(id) {
        try{
            const savedProducts = await this.getProducts();
            const targetProduct = await this.getProductById(id)
            const filteredList = savedProducts.filter(prod => prod.id !== id)
            if(!targetProduct){
                throw new Error('ERROR: No se encuentra la id especificada')
            }
            else{
                const productListString = JSON.stringify(filteredList, null, '\t')
                await fs.writeFile(this.path, productListString)
                console.log(`${targetProduct.title} eliminado`)
            }
        }
        catch(error){
            console.log(error.message)
        }
    }

    //CART

    async addCart() {
        try {
            const savedCart = await this.getProducts();
            if (!savedCart.length) {
                ProductManager.counterId = 1;
            } else {
                ProductManager.counterId = savedCart[savedCart.length - 1].id + 1;
            }

            const newCart = {
                id: ProductManager.counterId,
                products: []
            }
            savedCart.push(newCart);
            await fs.writeFile(this.path, JSON.stringify(savedCart, null, '\t'));
            return newCart;

        } catch (error) {
            console.error(error);
        }

    }

    async updateCart(cid, pid) {
        try {
            let cart = await this.getProducts();


            //busca en el cart si hay un obj con el mismo id que el cid
            const order = cart.find((obj) => obj.id === cid);


            if (order) {

                //si existe busca dentro de products si hay un producto con el mismo pid
                const productExist = order.products.find((obj) => obj.id === pid);

                if (productExist) {

                    //si el carrito ya tiene el producto que quiere agregar se le aumenta el quantity
                    const orderPosition = cart.findIndex(order => order.id === cid);
                    const updateProduct = cart[orderPosition].products.find(prod => prod.id === pid);

                    const productPosition = cart[orderPosition].products.findIndex(prod => prod.id === pid);

                    cart[orderPosition].products[productPosition].quantity = updateProduct.quantity + 1

                    const productListCart = JSON.stringify(cart, null, '\t')
                    await fs.writeFile(this.path, productListCart);
                    return productListCart;
                } else {
                    //si el carrito no tiene el producto del pid se agrega
                    const newProduct = { id: pid, quantity: 1 };
                    const orderPosition = cart.findIndex((order) => order.id === cid);
                    if (orderPosition <= 0) {
                        cart[orderPosition].products.push(newProduct);
                        console.log(cart);
                        const productListCart = JSON.stringify(cart, null, '\t')
                        await fs.writeFile(this.path, productListCart);
                        return productListCart;
                    }
                }

            } else {
                //si no existe el carrito con el cid se crea un nuevo carrito con el product
                const newOrder = {
                    id: cart.length + 1,
                    products: [{ id: pid, quantity: 1 }]
                };
                cart.push(newOrder);
                const productListCart = JSON.stringify(cart, null, '\t')
                await fs.writeFile(this.path, productListCart);
                return productListCart;
            }

        } catch (error) {
            console.error(error);
        }
    }

}

module.exports = ProductManager;