const ticketModel = require('../../schemas/ticket.model')
const HTTP_STATUS = require('../../../constants/api.constants')

class TicketMongoDao {
    
    async getAll() {
        const tickets = await ticketModel.find().lean()
        return tickets
    }

     async getById(tid) {
        const ticket = await ticketModel.findById(tid).lean()
        return ticket
    }

    async create(payload) {
        const newTicket = await ticketModel.create(payload)
        return newTicket
    }

    async updateById(tid, payload) {
        const updatedTicket = await ticketModel.updateOne({_id: tid}, payload)
        return updatedTicket
    }

    async delete(tid) {
        const deletedTicket = await ticketModel.deleteOne({_id: tid})
        return deletedTicket   
    }

}

module.exports = {TicketMongoDao}