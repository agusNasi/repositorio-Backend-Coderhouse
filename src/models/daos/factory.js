const { DATA_SOURCE } = require("../../config/enviroment.config");
const { logCyan } = require('../../utils/console.utils');
const MongoManager = require("../db/mongo/mongo.manager");

let cartsDao, chatsDao, productsDao, usersDao, ticketsDao

logCyan(`Using ${DATA_SOURCE} as persistence method`)

switch(DATA_SOURCE){

    case "FILE": {
        const CartFileDao = require('./file/CartFileDao')
        const ProductFileDao = require('./file/ProductFileDao')
        cartsDao = new CartFileDao()
        productsDao = new ProductFileDao()
        break;
    }

    case "MONGO": {
        MongoManager.connect()
        const CartMongoDao = require('./mongo/CartMongoDao')
        const { ProductMongoDao } = require('./mongo/ProductMongoDao')
        const ChatMongoDao = require('./mongo/ChatMongoDao')
        const UserMongoDao = require('./mongo/UserMongoDao')
        const { TicketMongoDao } = require("./mongo/TicketMongoDao.js");
        cartsDao = new CartMongoDao()
        productsDao = new ProductMongoDao()
        chatsDao = new ChatMongoDao()
        usersDao = new UserMongoDao()
        ticketsDao = new TicketMongoDao()
        break;
    }

    default: {
        throw new Error('You must provide a valid persistence method')
    }
}

const getDaos = () => {
    return {
        cartsDao,
        productsDao, 
        chatsDao,
        usersDao,
        ticketsDao
    }
}

module.exports = getDaos