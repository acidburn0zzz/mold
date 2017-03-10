let router = require('express').Router();
let passport = require('passport');
let Post = require('../models/orm').Post;
let User = require('../models/orm').User;
let Site = require('../models/orm').Site;
let Page = require('../models/orm').Page;
let util = require('../util/util');
let moment = require('moment');

function initialize_google(req, res, next) {
  User.create({
    name: req.body.name,
    username: req.body.username,
    password: User.generateHash(req.body.password),
    email: req.body.email,
    admin: true,
    google_id: '',
    display_picture: '',
  }).then(function(user) {
    Site.findOne().then(function(site) {
      site.update({
        name: req.body.sitename,
        initialized: true,
      });
      user.update({
        siteId: site.id,
      });
    });
    return next();
  });
}

function initialize_local(req, res, next) {
  User.create({
    name: req.body.name,
    username: req.body.username,
    password: User.generateHash(req.body.password),
    email: req.body.email,
    admin: true,
    google_id: '',
    display_picture: '',
  }).then(function(user) {
    Site.findOne().then(function(site) {
      site.update({
        name: req.body.sitename,
        initialized: true,
      });
      user.update({
        siteId: site.id,
      });
    });
    return next();
  });
}

router.get('/s/:page_name', function(req, res, next) {
  Site.findOne({ include: [Page] }).then(function(site) {
    Page.findOne({
      where: { url: req.params.page_name },
      rejectOnEmpty: true,
    }).then(function(page) {
      res.render('page_template', {
        site: site,
        pages: site.pages,
        page: page,
      });
    }).catch(function() {
      return next(
        util.ErrorCreator(404, "Could not find page", site, "/")
      );
    });
  });
});

router.get('/setup', function(req, res, next) {
  Site.findOne().then(function (site) {
    if (site.initialized == true) {
      res.redirect('/');
    } else {
      res.render('setup', {site: site});
    }
  });
});

router.post('/setup',
  initialize_local,
  passport.authenticate('local', { failureRedirect: '/' }),
  function(req, res, next) { res.redirect('/dash') });

router.get('/', util.initialized, function(req, res, next) {
  Site.findOne({
    include: [{
      model: Page
    }]
  }).then(function(site) {
    Post.findAndCountAll({
      where: { draft: false },
      limit: 5,
      order: [
        ['date', 'DESC']
      ]
    }).then(function(posts) {
      res.render('index', {
        pages: site.pages,
        posts: posts.rows,
        site: site,
        page_count: Math.ceil(posts.count / 5),
      });
    });
  });
});

router.get('/page/:page_number(\d+)', util.initialized, function(req, res, next) {
  Site.findOne({
    include: [{
      model: Page
    }]
  }).then(function(site) {
    let offset = (req.params.page_number - 1) * 5;
    Post.findAndCountAll({
      where: { draft: false },
      limit: 5,
      offset: offset,
      order: [
        ['date', 'DESC']
      ]
    }).then(function(posts) {
      if (req.params.page_number > Math.ceil(posts.count / 5)) {
        return next(util.ErrorCreator(404, "Could not find page", site, "/"));
      }
      res.render('index', {
        pages: site.pages,
        posts: posts.rows,
        site: site,
        page_count: Math.ceil(posts.count / 5),
      });
    }).catch(function() {
      return next(util.ErrorCreator(404, "Could not find page", site, "/"));
    });
  });
});

router.get('/p/:slug', function(req, res, next) {
  Site.findOne({ include: [Page] }).then(function(site) {
    Post.findOne({
      where: {
        slug: req.params.slug,
        draft: false,
      },
      rejectOnEmpty: true,
    }).then(function(post) {
      User.findOne({
        where: {
          id: post.userId,
        }
      }).then(function(user) {
        post.update({
          views: post.views += 1,
        }).then(function() {
          res.render('post',{
            pages: site.pages,
            post: post,
            user: user,
            site: site,
          });
        });
      });
    }).catch(function () {
      return next(util.ErrorCreator(404, "Could not find post", site, "/"));
    });
  });
});

router.get('/auth/google', passport.authenticate('google', {scope: ['email']}));

router.get('/auth/google/callback', 
  passport.authenticate('google', {failureRedirect: '/login'}),
  function(req, res) {
    res.redirect('/dash');
  });

module.exports = router;
