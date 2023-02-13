const CartModel = require('../models/carts.models');
const { ProductModel } = require('../models/products.models')

class CartMongoManager {


    async addCart(){
        try{
            const newCart = await CartModel.create({})
            return newCart
        }
        catch(error){
            throw new Error(error.message)
        }
    }

    async getCarts() {
        try {
            const response = await CartModel.find();
            return response;
        } catch (error) {
            throw new Error(`${error}`);
        }
    }

    async getCartById(id) {
        try{
            const cart = await CartModel.findById(id).lean();
            return cart;
        }
        catch(error){
            throw new Error(error.message)
        }
    }

    async addProductToCart(cartId, productId, amount){
        try {
            let cart = await this.getCartById(cartId)
            const Originalproduct = await ProductModel.findById(productId)
            const productToAdd = cart.products.findIndex(product => product.product._id == productId)
            if(productToAdd < 0){
                cart.products.push({product: productId, quantity: amount})
            }else{
                cart.products[productToAdd].quantity += amount
            }
            let result = await CartModel.updateOne({_id:cartId}, cart) 
            return result          
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async updateProducts (cartId, newProducts){
        try {
            const cart = await this.getCartById(cartId);
            cart.products = newProducts;
            await CartModel.updateOne({_id:cartId}, cart);
            return newProducts;
            
        } catch (error) {
            console.log(error);
        }
    }

    async deleteProductFromCart(cartId, productId){
        try {
            const cart = await this.getCartById(cartId);
            const productToDelete = cart.products.find(product => product.product._id == productId);
            const index = cart.products.indexOf(productToDelete);
            if(index < 0){
                throw new Error('Product not found');
            }
            cart.products.splice(index, 1);
            const result = CartModel.updateOne({_id:cartId}, cart);
            return result;
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async deleteAllProducts(cartId){
        try {
            const cart = await this.getCartById(cartId)
            cart.products = []
            const result = CartModel.updateOne({_id:cartId}, cart)
            return result
        } catch (error) {
            throw new Error(error.message)
        }
    }
}


module.exports = CartMongoManager;