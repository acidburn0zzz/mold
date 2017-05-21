import {User} from '../models'
import {Strategy as JWTStrat, ExtractJwt} from 'passport-jwt'
import Passport from 'passport'
let LocalStrat = require('passport-local').Strategy
let env = process.env.NODE_ENV || 'development'
let config = require('./config.json')[env]

Passport.use(new LocalStrat((username, password, next) => {
  User.findOne({
    where: {
      username: username
    }
  }).then((user) => {
    if (user.validPassword(password)) {
      return next(null, user)
    } else {
      return next(null, false)
    }
  }).catch(() => {
    return next(null, false)
  })
}))

Passport.use(new JWTStrat({
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  secretOrKey: config.jwt_key
}, (jwtPayload, next) => {
  User.findOne({
    where: {
      id: jwtPayload.id
    },
    rejectOnEmpty: true
  }).then((user) => {
    return next(null, user)
  }).catch(() => {
    return next(null, false)
  })
}))

module.exports = Passport
