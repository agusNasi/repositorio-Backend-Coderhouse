const { logCyan } = require('../../../utils/console.utils')
const userModel = require('../../schemas/user.model')

class UserMongoDao {
    
    async getAll() {
        const users = await userModel.find().lean()
        return users
    }

    async getById(uid){
        const user = await userModel.findById(uid).lean()
        return user
    }

    async getByEmail(email){
        const user = await userModel.findOne({email: email}).lean()
        return user
    }

    async addUser(payload){
        const newUser = await userModel.create(payload)
        return newUser
    }

    async updateUser(uid, payload){
        const updatedUser = await userModel.findByIdAndUpdate(uid, {$set: payload})
        return updatedUser
    }

    async deleteUser(uid) {
        const deletedUser = await userModel.findByIdAndDelete(uid);
        return deletedUser;
      }
}

module.exports = UserMongoDao