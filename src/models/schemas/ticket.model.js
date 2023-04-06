const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const ticketCollection = 'tickets'

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    purchase_datetime: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: String,
        required: true,
    }
})

ticketSchema.plugin(mongoosePaginate)
const ticketModel = mongoose.model(ticketCollection, ticketSchema)

module.exports = ticketModel