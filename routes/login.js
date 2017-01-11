let router = require('express').Router();
let bcrypt = require('bcrypt-nodejs');
let util = require('../util/util');
let Passport = require('../config/passport');
let Page = require('../models/orm').Page;
let Site = require('../models/orm').Site;

router.get('/', util.initialized, function(req, res, next) {
  Site.findOne({ include: [Page] }).then(function(site) {
    res.render('login', {
      site: site,
      pages: site.pages,
    });
  });
});

router.post('/',
  Passport.authenticate('local', {failureRedirect: '/' }),
  function(req, res) {res.redirect('/dash')});

module.exports = router;
