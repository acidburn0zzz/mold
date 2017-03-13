let router = require('express').Router();
import {User, Site, Post, Image} from '../../models';
//let Post = require('../models/orm').Post;
//let User = require('../models/orm').User;
//let Media = require('../models/orm').Media;
//let Site = require('../models/orm').Site;
//let Page = require('../models/orm').Page;
let passport = require('passport');
let slug = require('slug');
let moment = require('moment');
let util = require('../util/util');
let imageMagick = require('imagemagick');
let markdown = require('../config/markdown');
let image_upload = require('../config/multer').image_upload;
let display_picture_upload = require('../config/multer').display_picture_upload;
let Promise = require('bluebird');
let fs = require('fs');
import path from 'path';
Promise.promisifyAll(imageMagick);
Promise.promisifyAll(fs);

function excerpter(string, word_count) {
  return string.substr(0, string.lastIndexOf(' ', word_count)) + '...';
}

router.use(util.is_logged_in);

router.get('/',  function(req, res, next) {
  res.render('dash/index', {
    user: req.user,
  });
});

router.get('/media',  function(req, res, next) {
  Image.findAll({
    order: [
      ['createdAt', 'DESC']
    ]
  }).then(function(media) {
    res.render('dash/media', {
      media: media,
    });
  });
});

router.get('/media/upload',  function(req, res, next) {
  res.render('dash/media_upload');
});

router.get('/media/edit/:media_id', function(req, res, next) {
  Image.findOne({
    where: {
      id: req.params.media_id,
    },
    rejectOnEmpty: true,
  }).then(function(media) {
    res.render('dash/media_edit', {
      image: media,
    });
  }).catch(function(err) {
    let error = new Error();
    error.status = 404;
    error.message = "Could not find an image with ID: " + req.params.media_id;
    error.back = "/dash/media";
    return next(error);
  });
});

router.post('/media/edit/:media_id', image_upload.single('image'), function(req, res, next) {
  Image.findOne({
    where: {
      id: req.params.media_id,
    },
    rejectOnEmpty: true,
  }).then(function(media) {
    if (req.file) {
      fs.unlinkAsync(media.file_name).then(function() {
        media.update({
          name: req.body.name,
          path: '/'+req.file.path,
          filename: req.file.filename,
          destination: req.file.destination,
        });
      });
    } else {
      media.update({
        name: req.body.name,
      });
    }
  }).catch(function(err) {
    console.log(err);
    let error = new Error();
    error.status = 400;
    return next(error);
  });
  res.redirect('/dash/media/edit/' + req.params.media_id);
});

router.post('/media/upload', image_upload.single('image'), function(req, res, next) {
  Image.create({
    path: '/' + req.file.path,
    file_name: req.file.filename,
    file_path: path.resolve(req.file.destination + req.file.filename),
  }).then(function() {
    res.redirect('/dash/media');
    return null;
  }).catch(function() {
    let error = new Error();
    error.status = 400;
    return next(error);
  });
});

router.get('/media/delete/:media_id', function(req, res, next) {
  Image.findOne({
    where: {
      id: req.params.media_id,
    },
    rejectOnEmpty: true,
  }).then(function(media) {
    fs.unlinkAsync(media.file_path).then(function() {
      media.destroy();
      res.redirect('/dash/media');
    }).catch(function (err) {
      media.destroy();
      console.log(err);
      let error = new Error();
      error.status = 500;
      error.message = "Could not delete media file on disk";
      return next(error);
    });
  });
});

router.get('/profile',  function(req, res, next) {
  res.render('dash/profile', {
    user: req.user
  });
});

router.get('/profile/google', 
  passport.authenticate('google', {scope: ['email'] }),
  function(req, res) { res.redirect('/profile') });

router.post('/profile', display_picture_upload.single('display_picture'), function(req, res, next) {
  if (req.body.current_password && req.user.validPassword(req.body.current_password)) {
    if (req.body.new_password == req.body.new_password_repeated) {
      req.user.update({
        password: User.generateHash(req.body.new_password),
      }).then(function() {});
    }
  }
  req.user.update({
    username: req.body.username,
    name: req.body.name,
    email: req.body.email,
  }).then(function(user) {
    if (req.file) {
      imageMagick.resizeAsync({
        srcPath: req.file.path,
        dstPath: req.file.path,
        width: 64
      }).catch(function () {
        let error = new Error();
        error.status = 500;
        error.message = "ImageMagick had a fatal error"
        return next(error);
      });
      user.update({
        display_picture: '/' + req.file.path,
      }).then(function() {});
    }
    res.render('dash/profile', {
      user: req.user,
      change: true,
    });
  }).catch(function() {
    let error = new Error();
    error.status = 400;
    return next(error);
  });
});

router.get('/logout',  function(req, res, next) {
  req.logout();
  res.redirect('/');
});

router.get('/posts',  function(req, res, next) {
  Post.findAll({
  }).then(function(posts) {
    User.findOne().then(function(user) {
      res.render('dash/posts', {
        posts: posts,
        user: user,
      });
    });
  });
});

router.get('/posts/delete/:post_id',  function(req, res, next) {
  Post.findOne({
    where: {
      id: req.params.post_id,
    }
  }).then(function(post) {
    if (post.header_image) {
      fs.unlinkAsync(post.header_image.substring(1)).catch(function () {
        let error = new Error();
        error.status = 500;
        error.message = "Could not delete media file on disk";
        return next(error);
      });
    }
    post.destroy();
    res.redirect('/dash/posts')
  })
});

router.get('/compose',  function(req, res, next) {
  res.render('dash/compose');
});

router.post('/posts/edit/:post_id',  image_upload.single('header_image'), function(req, res, next) {
  Post.findOne({
    where: {
      id: req.params.post_id,
    },
    rejectOnEmpty: true,
  }).then(function(post) {
    if (post.header_image && req.file) {
      fs.unlinkAsync(post.header_image.substring(1)).catch(function() {
        let error = new Error();
        error.status = 500;
        error.message = "Could not change media file on disk";
        return next(error);
      });
    }
    post.update({
      title: req.body.title,
      date: moment(req.body.date_time),
      pretty_date: req.body.date,
      rendered: markdown.render(req.body.body),
      content: req.body.body,
      excerpt: markdown.render(excerpter(req.body.body, 750)),
      draft: req.body.draft ? true : false,
      slug: slug(req.body.title, {lower: true}),
      views: req.body.clear_views ? 0 : post.views,
      header_image: req.file ? '/' + req.file.path : post.header_image,
    }).then(function(post) {
      res.redirect('/dash/posts');
    });
  }).catch(function() {
    let error = new Error();
    error.status = 400;
    return next(error);
  });
});

router.get('/posts/edit/:post_id',  function(req, res, next) {
  Post.findOne({
    where: {
      id: req.params.post_id,
    },
    rejectOnEmpty: true
  }).then(function(post) {
    res.render('dash/edit_post', {
      post: post,
      // Add a day because of some weird UTC shit
      post_date: moment(post.date).add(1, 'day').format('YYYY-MM-DD'),
    });
  }).catch(function (err) {
    let error = new Error();
    error.status = 404;
    error.message = "Could not find a post with ID: " + req.params.post_id;
    error.back = "/dash/posts";
    return next(error);
  });
});

router.post('/compose',  image_upload.single('header_image'), function(req, res, next) {
  Site.findOne().then(function(site) {
    Post.findAndCountAll({
      where: {
        title: req.body.title,
      },
    }).then(function(repeats) {
      let post_slug = slug(req.body.title, {lower: true});
      if (repeats.count >= 1) {
        post_slug = slug(req.body.title + "_" + repeats.count, {lower: true});
      }
      Post.create({
        title: req.body.title,
        date: moment(req.body.date_time),
        pretty_date: req.body.date,
        content: req.body.body,
        rendered: markdown.render(req.body.body),
        excerpt: markdown.render(excerpter(req.body.body, 750)),
        draft: req.body.draft ? true : false,
        slug: post_slug,
        views: 0,
        header_image: req.file ? '/' + req.file.path : null,
        userId: req.user.id,
        siteId: site.id,
      }).then(function() {
        res.redirect('/dash/posts');
      }).catch(function() {
        let error = new Error();
        error.status = 400;
        return next(error);
      });
    });
  });
});

router.get('/settings', function(req, res, next) {
  Site.findOne().then(function(site) {
    res.render('dash/settings', {
      site: site,
    });
  });
});

router.post('/settings', function(req, res, next) {
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

router.get('/pages', function(req, res, next) {
  Page.findAll().then(function(pages) {
    res.render('dash/pages', {
      pages: pages,
    });
  });
});

router.get('/pages/new', function(req, res, next) {
  res.render('dash/new_page');
});

router.post('/pages/new', function(req, res, next) {
  Site.findOne().then(function(site) {
    Page.create({
      title: req.body.title,
      url: slug(req.body.title, { lower: true , replacement: '_'}),
      content: req.body.content,
      rendered: markdown.render(req.body.content),
      siteId: site.id,
    }).then(function() {
      res.redirect('/dash/pages');
    });
  });
});

router.get('/pages/edit/:page_id', function(req, res, next) {
  Page.findOne({
    where: {
      id: req.params.page_id
    },
    rejectOnEmpty: true,
  }).then(function(page) {
    res.render('dash/edit_page', {
      page: page
    });
    return page;
  }).catch(function() {
    let error = new Error();
    error.status = 404;
    error.message = "Could not find a page with ID: " + req.params.page_id;
    error.back = "/dash/pages";
    return next(error);
  });
});

router.post('/pages/edit/:page_id', function(req, res, next) {
  Page.update({
    title: req.body.title,
    url: slug(req.body.title, { lower: true, replacement: '_' }),
    content: req.body.content,
    rendered: markdown.render(req.body.content),
  }, {
    where: {
      id: req.params.page_id,
    }
  }).then(function() {
    res.redirect('/dash/pages');
  }).catch(function (err) {
    let error = new Error();
    error.status = 400;
    return next(error);
  });
});

router.get('/pages/delete/:page_id', function(req, res) {
  Page.destroy({
    where: { id: req.params.page_id }
  }).then(function() {
    res.redirect('/dash/pages');
  });
});

module.exports = router;
