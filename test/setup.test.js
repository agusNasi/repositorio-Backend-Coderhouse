const mongoose = require("mongoose")
const DB_CONFIG = require("../src/config/db.config.js")

before( async () =>{
    await mongoose.connect(DB_CONFIG.mongo.uri)
})

after(async ()=>{
    mongoose.connection.close()
})
