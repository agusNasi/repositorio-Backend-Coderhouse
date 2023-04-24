const express = require('express')
const apiRouter = require('./routers/app.routers')
const path = require('path')
const handlebars = require('express-handlebars')
const helpers = require('handlebars-helpers')
const viewsRoutes = require('./routers/views/views.routes')
const mockRoutes = require('./routers/mock/mock.routes')
const loggerTestRoutes = require('./routers/loggerTest/loggerTest.routes.js')
const { Server } = require('socket.io')
const passport = require('passport')
const initializePassport = require('./config/passport.config')
const { logGreen, logCyan, logRed } = require('./utils/console.utils')
const flash = require('connect-flash')
const cookieParser = require('cookie-parser')
const { PORT } = require('./config/enviroment.config')
const addLogger = require('./middlewares/logger.middleware.js')

const app = express()


//Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended:true }))
app.use('/statics', express.static(path.resolve(__dirname, '../public')))
app.use(cookieParser())
initializePassport()
app.use(passport.initialize())
app.use(flash())
app.use(addLogger)

//Router
app.use('/api', apiRouter)
app.use('/', viewsRoutes)
app.use('/mockingproducts', mockRoutes)
app.use('/loggerTest', loggerTestRoutes)

//Templates
const math = helpers.math();
app.engine('handlebars', handlebars.engine({
    helpers: {
        math
    }
}))
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