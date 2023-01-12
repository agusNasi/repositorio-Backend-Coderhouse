const express = require('express');
const handlebars = require('express-handlebars');
const apiRoutes = require('./routers/app.routers');
const viewsRoutes = require('./routers/views/views.router');
const path = require('path');
const { Server } = require('socket.io');


const PORT = 8080
const app = express();


app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use('/statics', express.static(path.resolve(__dirname, '../public')));

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use('/api', apiRoutes);
app.use('/', viewsRoutes);

const httpServer = app.listen(PORT, ()=>{
    console.log('Listening on port => ', PORT)
})

const io = new Server(httpServer) 

io.on('connection', socket => {
    console.log('new client connected')
    app.set('socket', socket)
})


