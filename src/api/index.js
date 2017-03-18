import {Router} from 'express';
import {Page, Post, Site, User, Image, sequelize} from '../../models';
import markdown from '../config/markdown';
import slug from 'slug';
import cache from 'sequelize-redis-cache';
import redis from 'redis';
import path from 'path'
import {image_upload} from '../config/multer';
import passport from '../config/passport';

let redisClient = redis.createClient(6379, 'localhost');
let router = Router();
let cachedPage = cache(sequelize, redisClient).model('Page').ttl(10);
let cachedSite = cache(sequelize, redisClient).model('Site').ttl(10);
let cachedUser = cache(sequelize, redisClient).model('User').ttl(10);
let cachedPost = cache(sequelize, redisClient).model('Post').ttl(10);
let cachedImage = cache(sequelize, redisClient).model('Image').ttl(10);

function authenticated(req, res, next) {
  //if (req.isAuthenticated()) {
  return next();
  //} else {
  //res.sendStatus(403);
  //}
};

router.post('/auth', passport.authenticate('local'), (req, res) =>
  {
    res.sendStatus(200);
  });

// Begin blog post API
//
router.get('/post', (req, res, next) => {
  cachedPost.findAll({
    where: {
      draft: false,
    },
    order: [
      ['createdAt', 'DESC']
    ],
    include: [{
      model: User,
      attributes: {
        exclude: User.postDefaultExcludeAttributes
      }
    }, {
      model: Image
    }, {
      model: Site,
      attributes: {
        exclude: Site.postDefaultExcludeAttributes
      }
    }],
  }).then((cachedPostRes) => {
    res.send(cachedPostRes);
  });
});

router.get('/post/:path', (req, res, next) => {
  cachedPost.findOne({
    where: {
      path: req.params.path,
      draft: false
    },
    include: [{
      model: User,
      attributes: {
        exclude: User.postDefaultExcludeAttributes
      }
    }, {
      model: Image
    }, {
      model: Site,
      attributes: {
        exclude: Site.postDefaultExcludeAttributes
      }
    }],
    rejectOnEmpty: true
  }).then((cachedPostRes) => {
    res.send(cachedPostRes);
  }).catch((error) => {
    res.send(error);
  });
});

router.post('/post', authenticated, (req, res, next) => {
  cachedSite.findOne().then((cachedSiteRes) => {
    cachedUser.findOne().then((cachedUserRes) => {
      Post.create({
        title: req.body.title,
        content: req.body.content,
        rendered: markdown.render(req.body.content),
        excerpt: markdown.render(req.body.content),
        draft: req.body.draft ? true : false,
        path: slug(req.body.title, { lower: true }),
        url: '/p/' + slug(req.body.title, { lower: true }),
        UserId: cachedUserRes.id,
        SiteId: cachedSiteRes.id,
      }).then((result) => {
        res.send(result);
      }).catch((error) => {
        res.send(error);
      });
    }).catch((error) => {
      res.send(error);
    });
  }).catch((error) => {
    res.send(error);
  });
});

router.put('/post/:path', authenticated, (req, res, next) => {
  Post.findOne({
    where: {
      path: req.params.path, 
    }
  }).then((post) => {
    post.update({
      title: req.body.title,
      content: req.body.content,
      rendered: markdown.render(req.body.content),
      excerpt: markdown.render(req.body.content),
      draft: req.body.draft ? true : false,
      url: slug(req.body.title, { lower: true }),
    }).then((result) => {
      res.send(result);
    }).catch((error) => {
      res.send(error);
    });
  }).catch((error) => {
    res.send(error);
  });
});

router.get('/user/posts', (req, res, next) => {
  cachedUser.findOne({
    attributes: {
      exclude: User.postDefaultExcludeAttributes
    },
    include: [{
      model: Post,
      where: {
        draft: false
      }
    }],
  }).then((user) => {
    res.send(user);
  }).catch((err) => {
    res.send(err);
  });
});

router.delete('/post/:path', authenticated, (req, res, next) => {
  Post.destroy({
    where: {
      path: req.params.path,
    }
  }).then((result) => {
    res.send(result);
  }).catch((error) => {
    res.send(error);
  });
});

// Begin image api

router.get('/image', (req, res, next) => {
  cachedImage.findAll().then((images) => {
    res.send(images);
  }).catch((error) => {
    res.send(error);
  });
});

router.get('/image/:id', (req, res, next) => {
  cachedImage.findOne({
    where: {
      id: req.params.id
    },
    rejectOnEmpty: true
  }).then((image) => {
    res.send(image);
  }).catch((error) => {
    res.send(error);
  });
});

router.get('/image/file/:file_name', (req, res, next) => {
  cachedImage.findOne({
    where: {
      file_name: req.params.file_name
    },
    rejectOnEmpty: true
  }).then((image) => {
    res.sendFile(image.file_path);
  }).catch((error) => {
    res.send(error);
  });
});

router.post('/image', image_upload.single('image'), (req, res, next) => {
  Image.create({
    path: '/' + req.file.path,
    file_name: req.file.filename,
    file_path: path.resolve(req.file.destination + req.file.filename)
  }).then((response) => {
    res.send(response);
  }).catch((error) => {
    res.send(error);
  });
});

// Begin site API

router.get('/site', (req, res, next) => {
  cachedSite.findOne({
    include: [{
      model: Page,
    }],
  }).then((cachedSiteRes) => {
    res.send(cachedSiteRes);
  }).catch((error) => {
    res.send(error);
  });
});

// Begin page API

router.get('/page', (req, res, next) => {
  Page.findAll({
    where: {
      draft: false
    },
  }).then((pages) => {
    res.send(pages);
  }).catch((error) => {
    res.send(error);
  });
});

router.get('/page/:path', (req, res, next) => {
  Page.findOne({
    where: {
      path: req.params.path
    },
    rejectOnEmpty: true
  }).then((page) => {
    res.send(page);
  });
});

router.post('/page', authenticated, (req, res, next) => {
  Site.findOne().then((cachedSiteRes) => {
    Page.create({
      title: req.body.title,
      content: req.body.content,
      rendered: markdown.render(req.body.content),
      draft: req.body.draft ? true : false,
      path: slug(req.body.title, { lower: true }),
      url: '/s/' + slug(req.body.title, { lower: true }),
      SiteId: cachedSiteRes.id,
    }).then((result) => {
      res.send(result);
    }).catch((error) => {
      res.send(error);
    });
  }).catch((error) => {
    res.send(error);
  });
});

export default router;
