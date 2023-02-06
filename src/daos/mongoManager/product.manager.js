const { ProductModel } = require('../models/products.models'); 


class ProductMongoManager {


    async getProducts({limit, page, query, sort}) {
        try {
            const filter = (query ? {category: query} : {})

            const options = {
                sort: (sort ? {price: sort} : {}),
                limit: limit || 10,
                page: page || 1,
                lean: true
            }

            const products = await ProductModel.paginate(filter,options)
            
            // const products = await productModel.aggregate([
            //     {
            //         $match: (query != undefined? {category: query}: {})
            //     },
            //     {
            //         $sort:{ price: sort }
            //     },
            //     {
            //         $limit: limit
            //     }
            // ])

            return products
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async addProduct() {
        try {
            const userCreated = await ProductModel.create({});
            return userCreated;
        } catch (error) {
            throw new Error(`Error saving: ${error}`);
        }
    }

    async getProductById(id) {
        try {
            const user = await ProductModel.findById(id);
            return user;
        } catch (error) {
            throw new Error(`Error updating ${error}`);
        }
    }

    async updateProduct(info, id) {
        try {
            const userUpdated = await ProductModel.findByIdAndUpdate(id, info,{new:true});
            return userUpdated;
        } catch (error) {
            throw new Error(`Error updating ${error}`);
        }
    }

    async deleteProduct(id) {
        try {
            const response = await ProductModel.findByIdAndDelete(id);
            return `${response.title} deleted successfully`;
        } catch (error) {
            throw new Error(`Error deleting: ${error}`);
        }
    }

}

module.exports = ProductMongoManager;