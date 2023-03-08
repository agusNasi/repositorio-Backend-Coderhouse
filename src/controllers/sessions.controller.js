const HTTP_STATUS = require ("../constants/api.constants.js")
const { apiSuccessResponse } = require("../utils/api.utils.js");
const HttpError = require("../utils/error.utils");

class SessionsController{

    static async login(req, res, next){
        try {
            if(!req.user){
                throw new HttpError(HTTP_STATUS.BAD_REQUEST, 'User not found')
            }
            const userSession = {
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                age: req.user.age,
                cart: req.user.cart,
                role: 'user'
            } 
            req.session.user = userSession
            req.session.save(err => {
                if (err){
                    logRed('session error: ', err);
                } 
                else {
                    res.redirect('/products');
                }
            })
        } catch (error) {
            next(error)
        }
    }   

    static async loginGithub(req, res, next){
        try {
            const sessionUser = {
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                age: req.user.age,
                email: req.user.email,
                githubLogin: req.user.githubLogin,
                role: 'user',
                cart: req.user.cart
            }
            req.session.user = sessionUser
            res.redirect('/products')
        } catch (error) {
            next(error)
        }
    }

    static async logout(req, res, next){
        try {
            await req.session.destroy(err => {
                if (err) {
                  logRed(err);
                }
                else {
                  res.clearCookie('start-solo');
                  res.redirect('/');
                }
              })
        } catch (error) {
            next(error) 
        }
    }

    static async currentSession(req, res, next){
        const response = apiSuccessResponse(req.session.user)
        return res.status(HTTP_STATUS.OK).json(response)
    }
}


module.exports = SessionsController