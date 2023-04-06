const { SESSION_KEY } = require("../config/enviroment.config.js");
const HTTP_STATUS = require ("../constants/api.constants.js");
const { apiSuccessResponse } = require("../utils/api.utils.js");
const HttpError = require("../utils/error.utils");
const { generateToken } = require("../utils/session.utils.js");

class SessionsController{

    static async login(req, res, next){
        const { user } = req;
        try {
            if(!user){
                throw new HttpError(HTTP_STATUS.BAD_REQUEST, 'User not found')
            }
            const access_token = generateToken(user);
            res.cookie(SESSION_KEY, access_token, {
              maxAge: 60 * 60 * 24 * 1000,
              httpOnly: true
            });
            res.redirect('/products');
        } catch (error) {
            next(error)
        }
    }   

    static async loginGithub(req, res, next){
        const { user } = req;
        const access_token = generateToken(user);
        res.cookie(SESSION_KEY, access_token, {
        maxAge: 60 * 60 * 24 * 1000,
        httpOnly: true
        });
        res.redirect('/products');
    }

    static async logout(req, res, next){
        try {
            res.clearCookie(SESSION_KEY);
            res.redirect('/');
        } catch (error) {
            next(error) 
        }
    }

    static async currentSession(req, res, next){
        const response = apiSuccessResponse(req.user);
        return res.json(response);
    }
}


module.exports = SessionsController