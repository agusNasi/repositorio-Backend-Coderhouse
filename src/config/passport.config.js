const passport = require('passport');
const local = require('passport-local');
const github = require('passport-github2')
const userService = require('../daos/models/user.model');
const { createHash, isValidPassword } = require('../utils');

const LocalStrategy = local.Strategy
const GithubStrategy = github.Strategy


const initializePassport = () =>{
    passport.use('register', new LocalStrategy(
        {
            passReqToCallback: true,
            usernameField: 'email'
        },
        async (req, username, password, done)=>{
            const { name, lastName, email, age } = req.body
            if(!name || !lastName || !age || !email || !password){
                console.log('missing fields');
                return done(null, false)
            }
            try {
                let user = await userService.findOne({email:username})
                if(user){
                    console.log('User already exist');
                    return done(null, false)
                }
                const newUser = {
                    name,
                    lastName, 
                    email,
                    age,
                    password: createHash(password)
                }
                let result = await userService.create(newUser)
                return done(null, result)
            } catch (error) {
                return done('Error getting user: ' + error)
            }
        }

    )),
    passport.use('login', new LocalStrategy(
        {usernameField: 'email'},
        async(username, password, done) =>{
            try {
                const user = await userService.findOne({email:username})
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
            clientID: 'Iv1.edc0e8c111cd9b2e',
            clientSecret: '2b7480f4afea85fdee9a0accc529a098fe73d800',
            callbackURL: 'http://localhost:8080/api/session/github/callback'
        },
        async (accessToken, refreshToken, profile, done)=>{
            try {
                const userData = profile._json
                const user = await userService.findOne({ email: userData.email})
                if(!user){
                    const newUser = {
                        name: userData.name.split(' ')[0] || null,
                        lastName: userData.name.split(' ')[1] || null,
                        age: userData.age || null,
                        email: userData.email || null,
                        password: null,
                        githubLogin: userData.login
                    }
                    const response = userService.create(newUser)
                    const user = response._doc
                    done(null, user)
                }else{
                    done(null, user)
                }
            } catch (error) {
                console.log('Github login error: ' + error);
                done(error)
            }
        }
    ))
}



passport.serializeUser((user, done) => {
    done(null, user._id);
});
  
passport.deserializeUser(async (id, done) => {
    const user = await userService.findById(id);
    done(null, user);
});

module.exports = initializePassport

