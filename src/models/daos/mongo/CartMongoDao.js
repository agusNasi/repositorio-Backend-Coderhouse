const cartModel = require('../../schemas/cart.model')
const { logCyan } = require('../../../utils/console.utils')
class CartMongoDao {

    async getAll() {
        const carts = await cartModel.find()
        return carts
    }

    async getById(id) {
        const cart = await cartModel.findById(id).lean()
        return cart
    }

    async add(){
        const newCart = await cartModel.create({})
        logCyan('New cart created')
        return newCart
    }

    async addProductToCart(cid, pid, amount){
        const updatedCart = await cartModel.findByIdAndUpdate(cid, {
            $push: {
                products: {
                    product: pid,
                    quantity: amount
                }
            }
        })
        logCyan(`product ${pid} added to cart`)
        return updatedCart
    }

    async updateCart(cid, payload){
        const updatedCart = await cartModel.findByIdAndUpdate(cid, payload)
        return updatedCart
    }

    async deleteProductFromCart(cid, pid){
        const cart = cartModel.updateOne({ _id: cid}, {$pull: {products: {product: {_id: pid}}}})
        logCyan(`product ${pid} deleted from cart`)
        return cart
    }

    async deleteAllProducts(cid){
        const emptyCart = cartModel.updateOne({ _id: cid}, {$pull: {products: {}}})
        logCyan(`cart empty`)
        return emptyCart
    }
}

module.exports = CartMongoDao