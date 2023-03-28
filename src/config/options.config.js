const enviroment = require('./enviroment.config')

const options = {
    fileSystem: {
        productsFileName: "products.json"
    },
    mongoDB: {
        url: enviroment.MONGO_URI
    }
}

module.exports = options