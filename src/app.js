const express = require('express')
const apiRoutes = require('./routers/app.routers')
const path = require('path')
const handlebars = require('express-handlebars')
const viewsRoutes = require('./routers/views/views.routes')
const { Server } = require('socket.io')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const passport = require('passport')
const initializePassport = require('./config/passport.config')
const { logGreen, logCyan, logRed } = require('./utils/console.utils')
const flash = require('connect-flash')
const options = require('./config/options')
require('./config/dbConfig')

const PORT = 8080
const app = express()

//Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended:true }))
app.use('/statics', express.static(path.resolve(__dirname, '../public')))
app.use(session({
    name: 'session',
    secret:'contraseña123' ,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true
    },
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: options.mongoDB.url,
        ttl: 3600
    })
}))
initializePassport()
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

//Main Routes
app.use('/api', apiRoutes)
app.use('/', viewsRoutes)

//Templates
app.engine('handlebars', handlebars.engine())
app.set('views', path.resolve(__dirname, './views'));
app.set('view engine', 'handlebars');

//Server
const server = app.listen(PORT, "127.0.0.1", () => {
    const host = server.address().address;
    const port = server.address().port;
    logGreen(`Server is up and running on http://${host}:${port}`);
});

// Server error
server.on("error", (error) => {
    logRed("There was an error starting the server");
    logRed(error);
  });

//Sockets
const io = new Server(server)

io.on('connection', (socket)=>{
    logCyan("new client connected");
    app.set('socket', socket)
    app.set('io', io)
    socket.on('login', user =>{
        socket.emit('welcome', user)
        socket.broadcast.emit('new-user', user)
    })
})