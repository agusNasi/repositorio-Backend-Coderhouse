const messageModel = require('../../schemas/message.model')
const { logYellow } = require('../../../utils/console.utils')

class ChatMongoDao {
    
    async getAll() {
        const messages = await messageModel.find().lean()
        return messages
    }

    async add(newMessage) {
        const message = await messageModel.create(newMessage)
        return message
    }

    async delete(mid) {
        const cleanChat = await messageModel.deleteOne({_id: mid})
        req.logger.info(`message deleted`)
        return cleanChat  
    }

    async deleteAll() {
        const cleanChat = await messageModel.deleteMany()
        req.logger.info(`all messages has been deleted`)
        return cleanChat  
    }
}

module.exports = ChatMongoDao