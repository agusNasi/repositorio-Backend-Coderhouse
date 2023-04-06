const productModel = require('../../schemas/product.model')
const { logCyan, logYellow } = require('../../../utils/console.utils')

class ProductMongoDao {
    
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

     async getById(pid) {
        const product = await productModel.findById(pid)
        return product
    }

    async add(payload) {
        await productModel.create(payload)
        logCyan(`${payload.title} added`)
        const newProduct = {
            status: payload.status || true,
            thumbnails: payload.thumbnails || [],
            ...payload
        }
        return newProduct
    }

    async updateById(pid, payload) {
        const updatedProduct = await productModel.updateOne({_id: pid}, payload)
        logCyan(`${payload.title ?? 'product'} modified`)
        return updatedProduct
    }

    async delete(pid) {
        const deletedProduct = await productModel.deleteOne({_id: pid})
        logYellow(`product deleted`)
        return deletedProduct   
    }

}

module.exports = {ProductMongoDao}