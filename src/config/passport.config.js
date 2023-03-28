const passport = require('passport')
const local = require('passport-local')
const github = require('passport-github2')
const jwt = require('passport-jwt')
const { createHash, isValidPassword } = require('../utils/bcrypt.utils')
const CartMongoDao = require('../models/daos/mongo/CartMongoDao')
const UserMongoDao = require('../models/daos/mongo/UserMongoDao')
const { logRed } = require('../utils/console.utils')
const { cookieExtractor } = require('../utils/session.utils')
const { SECRET_KEY } = require('../constants/session.constants')
const { adminName, adminPassword } = require('./enviroment.config')

const userMongoDao = new UserMongoDao()
const cartMongoDao = new CartMongoDao()

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
                return done(null, false)
            }
            try {
                const user = await userMongoDao.getByEmail(username)
                const cart = await cartMongoDao.add()
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
                let result = await userMongoDao.addUser(newUser)
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
                if(username === adminName && password === adminPassword){
                    const user = {
                        firstName: 'Admin',
                        lastName: 'Coder',
                        email: adminName,
                        password: adminPassword,
                        role: 'admin'
                    }
                    return done(null, user)
                }
                const user = await userMongoDao.getByEmail(username)
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
                const user = await userMongoDao.getByEmail(userData.email)
                if(!user){
                    const cart = await cartMongoDao.add()
                    const newUser = {
                        firstName: userData.name.split(' ')[0],
                        lastName: userData.name.split(' ')[1],
                        age: userData.age || 0,
                        email: userData.email || ' ',
                        password: ' ',
                        githubLogin: userData.login,
                        cart: cart._id
                    }
                    const response = await userMongoDao.addUser(newUser)
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
            return done(null, jwt_payload)
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
    const user = await userMongoDao.getById(id)
    done(null, user);
});

module.exports = initializePassport