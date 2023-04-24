const { devLogger, prodLogger } = require('../utils/logger.js')
const args = require('../config/args.config.js')

const addLogger = (req, res, next) =>{
    if(args.mode === 'production'){
        req.logger = prodLogger
    }else{
        req.logger = devLogger
    }
    next()
}

module.exports = addLogger