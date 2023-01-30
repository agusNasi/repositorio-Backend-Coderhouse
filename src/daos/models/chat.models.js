const mongoose = require('mongoose');

const chatCollection = 'messages';

const chatSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    message:{
        type: String,
        required: true
    }
});

const ChatModel = mongoose.model(chatCollection, chatSchema);

module.exports = ChatModel;