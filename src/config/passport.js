let GoogleClient = require('./config').GoogleClient;
let User = require('../models/orm').User;
let Site = require('../models/orm').Site;
let Passport = require('passport');
let GoogleStrat = require('passport-google-oauth').OAuth2Strategy;
let LocalStrat = require('passport-local').Strategy;

Passport.use(new GoogleStrat({
  clientID: GoogleClient.client_id,
  clientSecret: GoogleClient.client_secret,
  callbackURL: GoogleClient.callback_url,
},
  function(access_token, refresh_token, profile, next) {
    User.findOne({
      where: {
        google_id: profile.id,
      },
    }).then(function(user) {
      // Do something for first then here
    }).catch(function (err) {
      return next(null, false);
      // Do something for this catch
    }).then(function() {
      User.findOne({
        where: {
          email: profile.emails[0].value,
        }
      }).then(function(user) {
        user.update({
          google_id: profile.id,
          google_token: access_token,
        }).then(function(user) {
          return next(null, user);
        });
      }).catch(function(err) {
        return next(null, false);
      });
    });
  })
);

Passport.use(new LocalStrat(function(username, password, next) {
  User.findOne({
    where: {
      username: username,
    }
  }).then(function(user) {
      if (user.validPassword(password)) {
        return next(null, user);
      } else {
        return next(null, false);
      }
  }).catch(function() {
    return next(null, false);
  });
}));

module.exports = Passport;
