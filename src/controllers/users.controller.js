const UserMongoDao = require("../models/daos/mongo/UserMongoDao");
const HTTP_STATUS = require ("../constants/api.constants.js")
const { apiSuccessResponse } = require("../utils/api.utils.js");
const HttpError = require("../utils/error.utils");

const usersDao = new UserMongoDao()

class UsersController{

    static async getAll(req, res, next) {
        try {
            const users = await usersDao.getAll()
            const response = apiSuccessResponse(users)
            return res.status(HTTP_STATUS.OK).json(response)
        } catch (error) {
            next(error)
        }
    }

    static async getById(req, res, next) {
        const { uid } = req.params
        try {
            const user = await usersDao.getById(uid)
            if(!user){
                throw new HttpError(HTTP_STATUS.NOT_FOUND, 'user not found')
            }
            const response = apiSuccessResponse(user)
            return res.status(HTTP_STATUS.OK).json(response)
        } catch (error) {
            next(error)
        }
    }

    static async addUser(req,res,next) {
        const newUser = req.body
        try {
            if(req.file){
                const paths = {
                    path: req.file.path,
                    originalName: req.file.originalname  
                    }  
                newUser.profilePic = paths
            }
            const addUser = await usersDao.addUser(newUser)
            const response = apiSuccessResponse(addUser)
            return res.status(HTTP_STATUS.CREATED).json(response)
        } catch (error) {
            next(error)
        }
    }

    static async updateUser(req, res, next){
        const { uid } = req.params
        const userData = req.body
        try {
            const updatedUser = await usersDao.updateUser(uid, userData)
            if (!updatedUser) {
                throw new HttpError(404, 'User not found');
            }
            const response = apiSuccessResponse(updatedUser)
            return res.status(HTTP_STATUS.OK).json(response)
        } catch (error) {
            next(error)
        }
    }

    static async deleteUser(req, res, next){
        const { uid } = req.params
        try {
            const deleteUser = await usersDao.deleteUser(uid)
            const response = apiSuccessResponse(deleteUser)
            return res.status(HTTP_STATUS.OK).json(response)
        } catch (error) {
            next(error)
        }
    }    
}

module.exports = UsersController