const productModel = require('../../schemas/product.model')
const { logCyan, logYellow } = require('../../../utils/console.utils')
const HttpError = require('../../../utils/error.utils')
const HTTP_STATUS = require('../../../constants/api.constants')
const MongoManager = require('../../db/mongo/mongo.manager')

class ProductMongoDao {

    constructor(){
        MongoManager.connect()
    }
    
    async getAll({limit, page, query, sort}) {
        let filter
        if(!query){
            filter =  {}
        }else if(query == 'true'){
            filter = {status: true}
        }else if(query == 'false'){
            filter = {status: false}
        }else{
            filter = {category: query}
        }
        const options = {
            sort: (sort ? {price: sort} : {}),
            limit: limit || 10,
            page: page || 1,
            lean: true
        }
        const products = await productModel.paginate(filter,options)
        return products
    }

     async getById(id) {
        const product = await productModel.findById(id)
        if(!product){
            throw new HttpError(HTTP_STATUS.NOT_FOUND, 'No product matches the specified ID')
        }
        return product
    }

    async add(product) {
        await productModel.create(product)
        logCyan(`${product.title} added`)
        const newProduct = {
            status: product.status || true,
            thumbnails: product.thumbnails || [],
            ...product
        }
        return newProduct
    }

    async updateById(id, product) {
        const updatedProduct = await productModel.updateOne({_id: id}, product)
        logCyan(`${product.title ?? 'product'} modified`)
        return updatedProduct
    }

    async delete(id) {
        const deletedProduct = await productModel.deleteOne({_id: id})
        logYellow(`product deleted`)
        return deletedProduct   
    }

}

module.exports = ProductMongoDao