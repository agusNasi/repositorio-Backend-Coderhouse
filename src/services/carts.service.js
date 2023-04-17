const HTTP_STATUS = require("../constants/api.constants.js");
const getDaos = require("../models/daos/factory.js");
const CustomError = require("../utils/customError.js");
const { generateCartErrorInfo } = require("../utils/error.info.js");
const HttpError = require("../utils/error.utils.js");

const { cartsDao, productsDao } = getDaos()

class CartsService {
    async getCarts() {
        const carts = await cartsDao.getAll()
        return carts
    }

    async getCartById(cid) {
        if(!cid){
            throw new HttpError('Missing param', HTTP_STATUS.BAD_REQUEST)
        }
        const cart = await cartsDao.getById(cid)
        if(!cart){
            throw new HttpError('Cart not found', HTTP_STATUS.NOT_FOUND)
        }
        return cart
    }

    async createCart() {
        const newCart = await cartsDao.add()
        return newCart
    }

    async addProductToCart(cid, pid, amount) {
        if(!cid || !pid || !amount){
            CustomError.createError({
                name: "Adding product to cart error",
                cause: generateCartErrorInfo({cid, pid, amount}),
                message: "Error trying to add product to cart",
                code: HTTP_STATUS.BAD_REQUEST
            })
        }
        const cart = await cartsDao.getById(cid)
        if(!cart){
            throw new HttpError('Cart not found', HTTP_STATUS.NOT_FOUND)
        }
        const product = await productsDao.getById(pid)
        if(!product){
            throw new HttpError('Product not found', HTTP_STATUS.NOT_FOUND)
        }
        if(product.stock < amount){
            throw new HttpError('Insufficient stock for selected product', HTTP_STATUS.BAD_REQUEST)
        }
        const existingProduct = cart.products.find(item => item.product.code === product.code)
        const existingProductIndex = cart.products.findIndex(item => item.product.code === product.code)
        let addedProduct
        if(existingProduct){
            cart.products[existingProductIndex].quantity += amount
            addedProduct = await cartsDao.updateCart(cid, cart)
        }else{
            addedProduct = await cartsDao.addProductToCart(cid, pid, amount)
        }
        return addedProduct
    }

    async deleteProduct(cid, pid) {
        if(!cid || !pid){
            throw new HttpError('Missing params', HTTP_STATUS.BAD_REQUEST)
        }
        const product = await productsDao.getById(pid)
        if(!product){
            throw new HttpError('Product not found', HTTP_STATUS.NOT_FOUND)
        }
        const cart = await cartsDao.getById(cid)
        if(!cart){
            throw new HttpError('Cart not found', HTTP_STATUS.NOT_FOUND)
        }
        const deletedProduct = await cartsDao.deleteProductFromCart(cid, pid)
        return deletedProduct
    }

    async clearCart(cid) {
        if(!cid){
            throw new HttpError('Please specify a cart ID', HTTP_STATUS.BAD_REQUEST)
        }
        const cart = await cartsDao.getById(cid)
        if(!cart){
            throw new HttpError('Cart not found', HTTP_STATUS.NOT_FOUND)
        }
        const emptyCart = await cartsDao.deleteAllProducts(cid)
        return emptyCart
    }
}

module.exports = CartsService