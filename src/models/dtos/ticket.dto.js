class GetTicketDTO {
    constructor(payload){
        this.code = payload.code
        this.date = payload.purchase_datetime
        this.amount = payload.amount
        this.purchaser = payload.purchaser
    }
}

class AddTicketDTO {
    constructor(purchaser, amount){
        this.purchaser = purchaser.email
        this.amount = amount
        this.purchase_datetime = new Date()
        this.code = `${Math.floor(Math.random()*1e10)}`
    }
}

module.exports = {
    GetTicketDTO,
    AddTicketDTO
}