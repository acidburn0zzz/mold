let router = require('express').Router();
let bcrypt = require('bcrypt-nodejs');
let util = require('../util/util');
let Passport = require('../config/passport');
import {Site} from '../../models';

router.get('/', function(req, res, next) {
  Site.findOne().then(function(site) {
    res.render('login', {
      site: site,
    });
  });
});

router.post('/',
  Passport.authenticate('local', {failureRedirect: '/' }),
  function(req, res) {res.redirect('/dash')});

module.exports = router;
