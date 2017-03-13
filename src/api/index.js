import {Router} from 'express';
import {Post, Site, User, Image, sequelize} from '../../models';
import markdown from '../config/markdown';
import slug from 'slug';
import cache from 'sequelize-redis-cache';
import redis from 'redis';
import path from 'path'
import {image_upload} from '../config/multer';
import passport from '../config/passport';

let redisClient = redis.createClient(6379, 'localhost');
let router = Router();
let cachedSite = cache(sequelize, redisClient).model('Site').ttl(60);
let cachedUser = cache(sequelize, redisClient).model('User').ttl(30);
let cachedPost = cache(sequelize, redisClient).model('Post').ttl(30);
let cachedImage = cache(sequelize, redisClient).model('Image').ttl(60);

function authenticated(req, res, next) {
  //if (req.isAuthenticated()) {
    return next();
  //} else {
    //res.sendStatus(403);
  //}
};

router.post('/auth',
  passport.authenticate('local', { failureRedirect: '/' }), (req, res) => {
    { res.sendStatus(200); } 
  });

// Begin blog post API
//
router.get('/post', (req, res, next) => {
  cachedPost.findAll({
    where: {
      draft: false,
    },
    include: [{
      model: User,
      attributes: {
        exclude: ['password', 'google_id', 'google_token']
      }
    }, {
      model: Image
    }],
  }).then((cachedPostRes) => {
    res.send(cachedPostRes);
  });
});

router.get('/post/:url', (req, res, next) => {
  cachedPost.findOne({
    where: {
      url: req.params.url,
      draft: false
    },
    include: [{
      model: User,
      attributes: {
        exclude: ['password', 'google_id', 'google_token']
      }
    }, {
      model: Image
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
        excerpt: req.body.content,
        draft: req.body.draft ? true : false,
        url: slug(req.body.title, { lower: true }),
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

router.put('/post/:url', authenticated, (req, res, next) => {
  Post.findOne({
    where: {
      url: req.params.url, 
    }
  }).then((post) => {
    post.update({
      title: req.body.title,
      content: req.body.content,
      rendered: markdown.render(req.body.content),
      excerpt: req.body.content,
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

router.delete('/post/:url', authenticated, (req, res, next) => {
  Post.destroy({
    where: {
      url: req.params.url,
    }
  }).then((result) => {
    res.send(result);
  }).catch((error) => {
    res.send(error);
  });
});

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

export default router;
