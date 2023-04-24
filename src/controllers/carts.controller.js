const HTTP_STATUS = require ("../constants/api.constants.js");
const CartsService = require("../services/carts.service.js");
const TicketsService = require("../services/tickets.service.js");
const { apiSuccessResponse } = require("../utils/api.utils.js");
const HttpError = require("../utils/error.utils.js");

const cartsService = new CartsService()
const ticketService = new TicketsService()

class CartsController{

    static async getAll(req, res, next) {
        try {
            const carts = await cartsService.getCarts()
            const response = apiSuccessResponse(carts)
            return res.status(HTTP_STATUS.OK).json(response)
        } catch (error) {
            next(error)
        }
    }

    static async getById(req, res, next) {
        const { cid } = req.params
        try {
            const cart = await cartsService.getCartById(cid)
            const response = apiSuccessResponse(cart)
            res.status(HTTP_STATUS.OK).json(response) 
        } catch (error) {
            next(error)
        }
    }

    static async addCart(req, res, next) {
        try {
            const addCart = await cartsService.createCart()
            req.logger.info('New cart created')
            const response = apiSuccessResponse(addCart)
            res.status(HTTP_STATUS.CREATED).json(response)
        } catch (error) {
            next(error)
        }
    }

    static async addProduct(req, res, next){
        try {
            const { cid, pid } = req.params
            const amount = +req.body?.amount || 1
            const addedProduct = await cartsService.addProductToCart(cid, pid, amount)
            req.logger.info(`product ${pid} added to cart ${cid}`)
            const response = apiSuccessResponse(addedProduct)
            res.status(HTTP_STATUS.OK).json(response)
        } catch (error) {
            next(error)
        }
    }
    
    static async removeProduct(req, res, next){
        const {cid, pid} = req.params
        try {
            const deletedProduct = await cartsService.deleteProduct(cid, pid)
            req.logger.info(`product ${pid} removed from cart ${cid}`)
            const response = apiSuccessResponse(deletedProduct)
            res.status(HTTP_STATUS.OK).json(response)
        } catch (error) {
            next(error)
        }
    }

    static async clearCart(req, res, next){
        const { cid }= req.params
        try {
            const emptyCart = await cartsService.clearCart(cid)
            req.logger.info(`cart ${cid} cleared`)
            const response = apiSuccessResponse(emptyCart)
            res.status(HTTP_STATUS.OK).json(response)
        } catch (error) {
            next(error)
        }
    }

    static async purchase(req, res, next){
        const purchaser = req.user
        const { cid } = req.params
        try {
            const cart = await cartsService.getCartById(cid)
            const payload = cart.products
            const ticket = await ticketService.createTicket(cid, payload, purchaser)
            req.logger.info(`Successful purchase`)
            const response = apiSuccessResponse(ticket)
            res.status(HTTP_STATUS.OK).json(response)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = CartsController