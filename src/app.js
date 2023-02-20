const express = require('express');
const path = require('path');
const handlebars = require('express-handlebars');
const { Server } = require('socket.io');
const cookieParser = require('cookie-parser')
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const initializePassport = require('./config/passport.config');
const apiRoutes = require('./routers/app.routers');
const viewsRoutes = require('./routers/views/views.router');
require('./config/dbConfig');


const PORT = 8080
const app = express();

//Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/statics', express.static(path.resolve(__dirname, '../public')));
app.use(cookieParser());
app.use(session({
    name: 'session',
    secret:'contraseña123' ,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://admin:coder@ecommerce.qhlhazv.mongodb.net/test",
        ttl: 3600
    })
}));
initializePassport();
app.use(passport.initialize());
app.use(passport.session());


//Routes
app.use('/api', apiRoutes);
app.use('/', viewsRoutes);


//Templates
app.engine('handlebars', handlebars.engine());
app.set('views', path.resolve(__dirname, './views'));
app.set('view engine', 'handlebars');


//Server
const httpServer = app.listen(PORT, () => {
    console.log('Listening on port => ', PORT)
})



//Sockets
const io = new Server(httpServer)

io.on('connection', socket => {
    console.log('new client connected');
    app.set('socket', socket)
    app.set('io', io)
    socket.on('login', user =>{
        socket.emit('welcome', user)
        socket.broadcast.emit('new-user', user)
    })
})


