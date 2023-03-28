const dotenv = require('dotenv')

dotenv.config()

module.exports = {
    PORT : process.env.PORT || 8080,
    MONGO_URI: process.env.MONGO_URI || '',
    DATABASE : process.env.DATABASE,
    DB_PASSWORD: process.env.DB_PASSWORD,
    ADMIN_NAME: process.env.ADMIN_NAME,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    DATA_SOURCE : process.env.DATA_SOURCE || '',
    SECRET_KEY : process.env.SECRET_KEY,
    SESSION_KEY : process.env.SESSION_KEY
}