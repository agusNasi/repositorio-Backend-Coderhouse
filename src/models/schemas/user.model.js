const mongoose = require('mongoose')

const userCollection = 'users'

const userSchema = new mongoose.Schema({
    first_name: { 
        type: String
    },
    last_name: { 
        type: String
    },
    email: { 
        type: String,
        unique: true
    },
    age: { 
        type: Number
    },
    password: {
        type: String
    },
    github_login:{
        type: String
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
        required: true
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'carts',
        required: true
    },
    profile_pic:{
        type: Object
    }
})

const userModel = mongoose.model(userCollection, userSchema)

module.exports = userModel