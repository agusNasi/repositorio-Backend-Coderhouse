const mongoose = require('mongoose')
const { logRed, logCyan } = require('../utils/console.utils')
const options = require('./options')

mongoose.set('strictQuery', false)
mongoose.connect(options.mongoDB.url, (error) => {
    if(error){
        return logRed(`db connection failed: ${error}`)
    }
    logCyan('connected to db');
})