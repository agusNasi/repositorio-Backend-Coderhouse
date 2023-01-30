const CartModel = require('../models/carts.models');

class CartMongoManager {


    async addCart() {
        try {
            const response = await CartModel.create({});
            return response;
        } catch (error) {
            throw new Error(`${error}`);
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
        try {
            const response = await CartModel.findOne({_id: id});
            return response;
        } catch (error) {
            throw new Error(`${error}`);
        }
    }

    async addProduct(cartId, productId){
        try {
            let cart = await this.getCartById(cartId)
            cart.products.push({product: productId})
            let result = await CartModel.updateOne({_id:cartId}, cart);
            return result          
        } catch (error) {
            throw new Error(error.message)
        }
    }
}


module.exports = CartMongoManager;