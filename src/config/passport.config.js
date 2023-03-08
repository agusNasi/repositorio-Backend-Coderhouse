const passport = require('passport')
const local = require('passport-local')
const github = require('passport-github2')
const { createHash, isValidPassword } = require('../utils/bcrypt.utils')
const CartManagerMongo = require('../models/daos/mongo/CartManagerMongo')
const UserManagerMongo = require('../models/daos/mongo/UserManagerMongo')
const { logRed } = require('../utils/console.utils')

const usersDao = new UserManagerMongo()
const cartsDao = new CartManagerMongo()
const LocalStrategy = local.Strategy
const GithubStrategy = github.Strategy

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
                const user = await usersDao.getByEmail(username)
                const cart = await cartsDao.addCart()
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
                    cart: cart._id
                }
                let result = await usersDao.addUser(newUser)
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
                const user = await usersDao.getByEmail(username)
                if(!user){
                    console.log('user not found')
                    return done(null, false)
                }
                if(!isValidPassword(user, password)){
                    return done(null, false)
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
                    const cart = await cartsDao.addCart()
                    const newUser = {
                        firstName: userData.name.split(' ')[0],
                        lastName: userData.name.split(' ')[1],
                        age: userData.age || 0,
                        email: userData.email || ' ',
                        password: ' ',
                        githubLogin: userData.login,
                        cart: cart._id
                    }
                    const response = await usersDao.addUser(newUser)
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
}

passport.serializeUser((user, done) => {
    done(null, user._id);
});
  
passport.deserializeUser(async (id, done) => {
    const user = await usersDao.getById(id)
    done(null, user);
});

module.exports = initializePassport