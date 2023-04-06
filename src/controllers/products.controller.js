const getDaos = require('../models/daos/factory')
const HTTP_STATUS = require ("../constants/api.constants.js")
const { apiSuccessResponse } = require("../utils/api.utils.js");
const ProductsService = require('../services/products.service.js');
const { AddProductDTO, GetProductDTO, UpdateProductDTO } = require('../models/dtos/products.dto.js');

const productsService = new ProductsService()

class ProductsController{

    static async getAll(req, res, next) {
        const filter = req.query
        try {
            const products = await productsService.getProducts(filter)
            const response = apiSuccessResponse(products)
            return res.status(HTTP_STATUS.OK).json(response)
        } catch (error) {
            next(error)
        }
    }

    static async getById(req, res, next) {
        const { pid } = req.params
        try {
            const product = await productsService.getProductById(pid)
            const response = apiSuccessResponse({product})
            return res.status(HTTP_STATUS.OK).json(response)
        } catch (error) {
            next(error)
        }
    }

    static async addProduct(req, res, next) {
        const productPayload = req.body
        const { files } = req
        try {
            const addProduct = await productsService.createProduct(productPayload, files)
            const response = apiSuccessResponse(addProduct)
            return res.status(HTTP_STATUS.CREATED).json(response)
        } catch (error) {
            next(error)
        }
    }

    static async updateProduct(req, res, next){
        const { pid } = req.params
        const productPayload = req.body
        try {
            const updatedProduct = productsService.updateProduct(pid, productPayload)
            const response = apiSuccessResponse(updatedProduct)
            return res.status(HTTP_STATUS.OK).json(response)
        } catch (error) {
            next(error)
        }
    }

    static async deleteProduct(req, res, next){
        const { pid } = req.params
        try {
            const deleteProduct = await productsService.deleteProduct(pid)
            const response = apiSuccessResponse(deleteProduct)
            return res.status(HTTP_STATUS.OK).json(response)
        } catch (error) {
            next(error)
        }
    }    
}

module.exports = ProductsController