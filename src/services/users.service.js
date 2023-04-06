const HTTP_STATUS = require("../constants/api.constants.js");
const getDaos = require("../models/daos/factory.js");
const HttpError = require("../utils/error.utils.js");

const { usersDao, cartsDao } = getDaos()

class UsersService {
    async getAll(){
        const users = await usersDao.getAll()
        return users
    }

    async getById(uid){
        if(!uid){
            throw new HttpError('Must provide an id', HTTP_STATUS.BAD_REQUEST)
        }
        const user = await usersDao.getById(uid)
        if(!user){
            throw new HttpError('User not found', HTTP_STATUS.NOT_FOUND)
        }
        return user
    }

    async createUser(payload, file){
        if(!Object.keys(payload).length){
            throw new HttpError('Missing data for user', HTTP_STATUS.BAD_REQUEST)
        }
        if(file){
            const paths = {
                path: file.path,
                originalName: file.originalname  
                }  
            payload.profilePic = paths
        }
        const newCart = await cartsDao.add()
        payload.cart = newCart._id
        const newUser = await usersDao.addUser(payload)
        return newUser
    }

    async updateUser(uid, payload){
        if(!uid || !Object.keys(payload).length){
            throw new HttpError('Missing data for user', HTTP_STATUS.BAD_REQUEST)
        }
        const user = await usersDao.getById(uid)
        if(!user){
            throw new HttpError('User not found', HTTP_STATUS.NOT_FOUND)
        }
        const updatedUser = await usersDao.updateUser(uid, payload)
        return updatedUser
    }

    async deleteUser(uid){
        if(!uid){
            throw new HttpError('Must provide an id', HTTP_STATUS.BAD_REQUEST)
        }
        const user = await usersDao.getById(uid)
        if(!user){
            throw new HttpError('User not found', HTTP_STATUS.NOT_FOUND)
        }
        const deletedUser = await usersDao.deleteUser(uid)
        return deletedUser
    }
}

module.exports = UsersService