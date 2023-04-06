const enviroment = require('./enviroment.config')

const options = {
    fileSystem: {
        productsFileName: "products.json"
    },
    mongoDB: {
        url: enviroment.mongoUrl
    }
}

module.exports = options