const mongoose = require('mongoose')

const userCollection = 'users'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    lastName: {
        type: String,
    },
    age: {
        type: Number,
    },
    email:{
        type: String,
        unique: true
    },
    password:{
        type: String,
    },
    githubLogin:{
        type: String,
    }
})

const UserModel = mongoose.model(userCollection, userSchema)

module.exports = UserModel