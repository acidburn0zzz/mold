let router = require('express').Router();
let Post = require('../models/orm').Post;
let User = require('../models/orm').User;
let Site = require('../models/orm').Site;
let passport = require('passport');
let moment = require('moment');
let util = require('../util/util');

router.use(util.is_logged_in);

router.get('/', function(req, res, next) {
  Site.findOne().then(function(site) {
    res.render('dash/settings', {
      site: site,
    });
  });
});

router.post('/', function(req, res, next) {
  Site.findOne().then(function(site) {
    site.update({
      name: req.body.site_name,
      open_registration: req.body.open_registration ? true : false,
    });
    res.render('dash/settings', {
      site: site,
    });
  });
});

module.exports = router;
