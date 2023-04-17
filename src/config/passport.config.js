const passport = require('passport')
const local = require('passport-local')
const github = require('passport-github2')
const jwt = require('passport-jwt')
const { createHash, isValidPassword } = require('../utils/bcrypt.utils')
const getDaos = require('../models/daos/factory')
const { logRed } = require('../utils/console.utils')
const { cookieExtractor } = require('../utils/session.utils')
const { SECRET_KEY } = require("../config/enviroment.config.js")
const { ADMIN_NAME, ADMIN_PASSWORD } = require('./enviroment.config')
const { AddUserDTO, GetUserDTO } = require('../models/dtos/users.dto.js')
const CustomError = require('../utils/customError.js')
const { generateUserErrorInfo } = require('../utils/error.info.js')
const HTTP_STATUS = require('../constants/api.constants.js')

const { cartsDao, usersDao } = getDaos()

const LocalStrategy = local.Strategy
const GithubStrategy = github.Strategy
const JwtStrategy = jwt.Strategy

const ExtractJWT = jwt.ExtractJwt

const initializePassport = () =>{
    //Local Register
    passport.use('register', new LocalStrategy(
        {
            passReqToCallback: true,
            usernameField: 'email'
        },
        async (req, username, password, done)=>{
            const { firstName, lastName, email, age } = req.body
            if(!firstName || !lastName || !age || !email || !password){
                logRed('missing fields');
                CustomError.createError({
                    name: "User creation error",
                    cause: generateUserErrorInfo({firstName, lastName, age, email}),
                    message: "Error trying to create user",
                    code: HTTP_STATUS.BAD_REQUEST
                })
                return done(null, false)
            }
            const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
            if(!email.match(validRegex)){
                logRed('not valid email');
                CustomError.createError({
                    name: "User creation error",
                    cause: generateUserErrorInfo({firstName, lastName, age, email}),
                    message: "Email adress not valid",
                    code: HTTP_STATUS.BAD_REQUEST
                })
                return done(null, false)
            }
            try {
                const user = await usersDao.getByEmail(username)
                const cart = await cartsDao.add()
                if(user){
                    const message = 'User already exist'
                    logRed(message);
                    return done(null, false, {message})
                }
                const newUser = {
                    firstName,
                    lastName, 
                    email,
                    age,
                    password: createHash(password),
                    cart: cart._id,
                }
                if(req.file){
                    const paths = {
                        path: req.file.path,
                        originalName: req.file.originalname  
                        }  
                    newUser.profilePic = paths
                } 
                const userPayload = new AddUserDTO(newUser)
                let result = await usersDao.addUser(userPayload)
                return done(null, result)
            } catch (error) {
                return done('Error getting user: ' + error)
            }
        }

    )),

    //Local Login
    passport.use('login', new LocalStrategy(
        {usernameField: 'email'},
        async(username, password, done) =>{
            try {
                if(username === ADMIN_NAME && password === ADMIN_PASSWORD){
                    const user = {
                        first_name: 'Admin',
                        last_name: 'Coder',
                        email: ADMIN_NAME,
                        password: ADMIN_PASSWORD,
                        role: 'admin',
                        cart: '640e0351f496d9111957b2de'
                    }
                    return done(null, user)
                }
                const user = await usersDao.getByEmail(username)
                if(!user){
                    return done(null, false, 'user not found')
                }
                if(!isValidPassword(user, password)){
                    return done(null, false, 'wrong user or password')
                }
                return done(null, user)
            } catch (error) {
                return done(error)
            }
        }
    ))

    //Github Strategy
    passport.use(
        new GithubStrategy({
            clientID: 'Iv1.b64438eddbef112a',
            clientSecret: '5d13665a8920d446f405d371dfbb9af26561a52e',
            callbackURL: 'http://localhost:8080/api/session/github/callback'
        },
        async (accessToken, refreshToken, profile, done)=>{
            const userData = profile._json
            try {
                const user = await usersDao.getByEmail(userData.email)
                if(!user){
                    const cart = await cartsDao.add()
                    const newUser = {
                        firstName: userData.name.split(' ')[0],
                        lastName: userData.name.split(' ')[1],
                        age: userData.age || 0,
                        email: userData.email || ' ',
                        password: ' ',
                        githubLogin: userData.login,
                        cart: cart._id
                    }
                    const userPayload = new AddUserDTO(newUser)
                    const response = await usersDao.addUser(userPayload)
                    const finalUser = response._doc
                    done(null, finalUser)
                    return
                }
                done(null, user)
            } catch (error) {
                logRed('Github login error: ' + error);
                done(error)
            }
        }
    ))

    // JWT
    passport.use('jwt', new JwtStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: SECRET_KEY
    }, async (jwt_payload, done) =>{
        try {
            console.log(jwt_payload);
            const userPayload = new GetUserDTO(jwt_payload)
            return done(null, userPayload)
        } catch (error) {
            return done(error)
        }
    }
    ))
}

passport.serializeUser((user, done) => {
    done(null, user._id);
});
  
passport.deserializeUser(async (id, done) => {
    const user = await usersDao.getById(id)
    done(null, user);
});

module.exports = initializePassport