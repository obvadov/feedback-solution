const passport = require('passport')
const User = require('../models/userModel')
const JwtStrategy = require('passport-jwt').Strategy // авторизация через JWT
const ExtractJwt = require('passport-jwt').ExtractJwt // авторизация через JWT

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET_TOKEN,
}

passport.use(
    new JwtStrategy(jwtOptions, async function (payload, done) {
        try {
            if (payload.exp < new Date().getTime()) return done(null, false)
            const user = await User.findById(payload.sub)
            if (user) {
                return done(null, user)
            }
            return done(null, false)
        } catch (err) {
            return done(err, false)
        }
    })
)
