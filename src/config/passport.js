let GoogleClient = require('./config').GoogleClient;
let Passport = require('passport');
let GoogleStrat = require('passport-google-oauth').OAuth2Strategy;
let LocalStrat = require('passport-local').Strategy;
import {User, Site} from '../../models';
import {Strategy as JWTStrat, ExtractJwt} from 'passport-jwt';

Passport.use(new GoogleStrat({
  clientID: GoogleClient.client_id,
  clientSecret: GoogleClient.client_secret,
  callbackURL: GoogleClient.callback_url,
}, (access_token, refresh_token, profile, next) => {
  User.findOne({
    where: {
      google_id: profile.id,
    },
  }).then((user) => {
    // Do something for first then here
  }).catch((err) => {
    return next(null, false);
    // Do something for this catch
  }).then(() => {
    User.findOne({
      where: {
        email: profile.emails[0].value,
      }
    }).then((user) => {
      user.update({
        google_id: profile.id,
        google_token: access_token,
      }).then((user) => {
        return next(null, user);
      });
    }).catch((err) => {
      return next(null, false);
    });
  });
})
);

Passport.use(new LocalStrat((username, password, next) => {
  User.findOne({
    where: {
      username: username,
    }
  }).then((user) => {
    if (user.validPassword(password)) {
      return next(null, user);
    } else {
      return next(null, false);
    }
  }).catch(() => {
    return next(null, false);
  });
}));

Passport.use(new JWTStrat({
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  secretOrKey: "testkey"
}, (jwt_payload, next) => {
  User.findOne({
    where: {
      id: jwt_payload.id
    },
    rejectOnEmpty: true
  }).then((user) => {
    return next(null, user);
  }).catch(() => {
    return next(null, false);
  });
}));

module.exports = Passport;
