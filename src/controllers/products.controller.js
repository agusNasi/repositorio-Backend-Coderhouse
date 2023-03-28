const ProductMongoDao = require("../models/daos/mongo/ProductMongoDao");
const HTTP_STATUS = require ("../constants/api.constants.js")
const { apiSuccessResponse } = require("../utils/api.utils.js");
const HttpError = require("../utils/error.utils");

const productsDao = new ProductMongoDao()

class ProductsController{

    static async getAll(req, res, next) {
        try {
            const products = await productsDao.getAll(req.query)
            const data ={
                status: 'success',
                payload: products.docs,
                totalPages: products.totalPages,
                prevPage: products.prevPage,
                nextPage: products.nextPage,
                page: products.page,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevLink: null,
                nexLink: null
            }
            const response = apiSuccessResponse(data)
            return res.status(HTTP_STATUS.OK).json(response)
        } catch (error) {
            next(error)
        }
    }

    static async getById(req, res, next) {
        const { pid } = req.params
        try {
            const product = await productsDao.getById(pid)
            if(!product){
                throw new HttpError(HTTP_STATUS.NOT_FOUND, 'product not found')
            }
            const response = apiSuccessResponse({product})
            return res.status(HTTP_STATUS.OK).json(response)
        } catch (error) {
            next(error)
        }
    }

    static async addProduct(req,res,next) {
        const newProduct = req.body
        try {
            if(req.files){
                const paths = req.files.map(file => {
                    return {path: file.path,
                     originalName: file.originalname  
                    }  
                    })
                newProduct.thumbnails = paths
            }else{
                newProduct.thumbnails = []
            }
            if(!Object.keys(newProduct).length){
                throw new HttpError(HTTP_STATUS.BAD_REQUEST, 'Missing product')
            }
            const addProduct = await productsDao.add(newProduct)
            const response = apiSuccessResponse(addProduct)
            return res.status(HTTP_STATUS.CREATED).json(response)
        } catch (error) {
            next(error)
        }
    }

    static async updateProduct(req, res, next){
        const productId = req.params.pid
        try {
            if(req.body.id){
                throw new HttpError(HTTP_STATUS.BAD_REQUEST, 'No id must be provided')
            }
            const updateProduct = await productsDao.updateById(productId, req.body)
            const response = apiSuccessResponse(updateProduct)
            return res.status(HTTP_STATUS.OK).json(response)
        } catch (error) {
            next(error)
        }
    }

    static async deleteProduct(req, res, next){
        const { pid } = req.params
        try {
            const deleteProduct = await productsDao.delete(pid)
            const response = apiSuccessResponse(deleteProduct)
            return res.status(HTTP_STATUS.OK).json(response)
        } catch (error) {
            next(error)
        }
    }    
}

module.exports = ProductsController