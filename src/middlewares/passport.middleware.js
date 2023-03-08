const passport = require('passport')
const HTTP_STATUS = require('../constants/api.constants')

const passportCall = (strategy, options = {}) =>{
    return async(req, res, next) =>{
        await passport.authenticate(strategy, {session: false, ...options},
            (error, user, info) => {
            if(error){
                return next(error)
            }
            if(!user){
                return res.status(HTTP_STATUS.UNAUTHORIZED).send({error: info?.messages ?? `${info}`})
            }
            req.user = user
            next()
        })(req, res, next)
    }
}

module.exports = passportCall