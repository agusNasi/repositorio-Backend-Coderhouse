const { ProductModel } = require('../models/products.models'); 


class ProductMongoManager {


    async getProducts() {
        try {
            const users = await ProductModel.find().lean();
            return users;
        } catch (error) {
            throw new Error(`Couldn't read file ${error}`)
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