const cartModel = require('../../schemas/cart.model')
const productModel = require('../../schemas/product.model')
const { logGreen, logCyan } = require('../../../utils/console.utils')
const { HttpError } = require('../../../utils/error.utils')
const HTTP_STATUS = require('../../../constants/api.constants')
const MongoManager = require('../../db/mongo/mongo.manager')

class CartMongoDao {

    constructor(){
        MongoManager.connect()
    }

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

    async addProductToCart(cartId, productId, amount){
        const updatedCart = await cartModel.findByIdAndUpdate(cartId, {
            $push: {
                products: {
                    product: productId,
                    quantity: amount
                }
            }
        })
        logCyan(`product ${productId} added to cart`)
        return updatedCart
        // let cart = await this.getCartById(cartId)
        // const Originalproduct = await productModel.findById(productId)
        // const productToAdd = cart.products.findIndex(product => product.product._id == productId)
        // if(productToAdd < 0){
        //     cart.products.push({product: productId, quantity: amount})
        // }else{
        //     cart.products[productToAdd].quantity += amount
        // }
        // logCyan(`product ${productId} added to cart`)
        // let result = await cartModel.updateOne({_id:cartId}, cart) 
        // return result
    }

    async updateProducts (cartId, newProducts){
        const cart = await this.getCartById(cartId)
        cart.products = newProducts
        await cartModel.updateOne({_id:cartId}, cart)
        logCyan(`product ${productId} updated`)
        return newProducts
    }

    async deleteProductFromCart(cartId, productId){
        const cart = await this.getCartById(cartId)
        const productToDelete = cart.products.find(product => product.product._id == productId)
        const index = cart.products.indexOf(productToDelete)
        if(index < 0){
            throw new HttpError(HTTP_STATUS.NOT_FOUND, 'Product not found')
        }
        cart.products.splice(index, 1)
        const result = cartModel.updateOne({_id:cartId}, cart)
        logCyan(`product ${productId} deleted from cart`)
        return result
    }

    async deleteAllProducts(cartId){
        const cart = await this.getCartById(cartId)
        cart.products = []
        const result = cartModel.updateOne({_id:cartId}, cart)
        logCyan(`cart empty`)
        return result
    }
}

module.exports = CartMongoDao