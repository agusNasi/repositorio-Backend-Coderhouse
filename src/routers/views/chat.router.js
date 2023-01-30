const { Router } = require('express')
const ChatModel = require('../../daos/models/chat.models');

const router = Router()

router.get('/', async (req,res)=>{
    const messages = await ChatModel.find().lean();
    res.render('chat', {
        messages,
        style: 'chat.css',
        title: 'Chat'
    });
})

router.post('/', async (req,res)=>{
    const io = req.app.get('io');
    const newMessage = req.body;
    await ChatModel.create(newMessage);
    io.emit('newMessage', newMessage);
})

router.delete('/', async (req,res)=>{
    await ChatModel.deleteMany();
    const io = req.app.get('io');
    io.emit('cleanChat', {});
})


module.exports = router

