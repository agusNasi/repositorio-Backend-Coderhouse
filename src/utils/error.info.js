const generateUserErrorInfo = (user) =>{
    return `One or more properties were incomplete or not valid.
    List of required properties:
     - firstName: needs to be a String, recieved ${user.firstName}
     - lastName: needs to be a String, recieved ${user.lastName},
     - age: needs to be a Number, recieved ${user.age}
     - email: needs to be a String and a valid email adress, recieved ${user.email}`
}

const generateProductErrorInfo = (product) =>{
    return `One or more properties were incomplete or not valid.
    List of required properties:
     - title: needs to be a String, recieved ${product.title}
     - description: needs to be a String, recieved ${product.description}
     - code: needs to be a String, recieved ${product.code}
     - stock: needs to be a Number, recieved ${product.stock}
     - price: needs to be a Number, recieved ${product.price}
     - category: needs to be a String, recieved ${product.category}`
}

const generateCartErrorInfo = (cartInfo) => {
    return `One or more properties were incomplete or not valid.
    List of required properties:
     - pid: needs to be a valid product ID, recieved ${cartInfo.pid}
     - cid: needs to be a valid cart ID, recieved ${cartInfo.cid}
     - amount: needs to be a Number, recieved ${cartInfo.amount}`
}

const generateTicketErrorInfo = (ticketInfo) =>{
    return `One or more properties were incomplete or not valid.
    List of required properties:
     - cid: needs to be a valid cart ID, recieved ${ticketInfo.cid}
     - payload: needs to be an array of products, received: ${ticketInfo.payload}
     - purchaser: needs to be a Number, recieved ${ticketInfo.purchaser}`
}

module.exports = {
    generateUserErrorInfo,
    generateProductErrorInfo,
    generateCartErrorInfo,
    generateTicketErrorInfo
}