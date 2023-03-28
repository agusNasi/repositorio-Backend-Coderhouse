const mongoose = require('mongoose')
const dbConfig = require('../../../config/db.config')
const { logRed, logCyan } = require('../../../utils/console.utils')

class MongoManager {
    static #instance = false
    constructor(){
        mongoose.set('strictQuery', false)
        mongoose.connect(dbConfig.mongo.uri, error => {
            if(error){
                logRed(`db connection failed: ${error}`)
                throw error
            }
            logCyan('connected to db')
        })
    }

    static connect(){
        if(!this.#instance){
            this.#instance = new MongoManager()
        }
        return this.#instance
    }
}

module.exports = MongoManager