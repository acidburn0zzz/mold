import {Router} from 'express';
import {Page, Post, Site, User, Image, sequelize} from '../../../models';
import {cachedPage, cachedPost, cachedSite, cachedUser, cachedImage} from '../../models/cached';
import markdown from '../../config/markdown';
import slug from 'slug';
import cache from 'sequelize-redis-cache';
import redis from 'redis';
import path from 'path'
import jwt from 'jsonwebtoken';
import {image_upload} from '../../config/multer';
import passport from '../../config/passport';
import Promise from 'bluebird';
const fs = Promise.promisifyAll(require("fs"));

let router = Router();

const locations = {
  post: '/api/v1/post/',
  page: '/api/v1/page/',
  image: '/api/v1/image/',
};

function excerpter(string) {
  let summary = new String(string);
  summary = summary.substr(0, summary.lastIndexOf(" ", 250));
  return markdown.render(summary.valueOf())
}

const authenticated = (req, res, next) => { return next() };
//const authenticated = passport.authenticate('jwt', { session: false });

router.get('/auth/google', passport.authenticate('google', { scope: ['email'] }));

router.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
  res.sendStatus(200);
});

router.post('/auth', (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    },
    rejectOnEmpty: true
  }).then((user) => {
    if (user.validPassword(req.body.password)) {
      const token = jwt.sign({ id: user.id }, "testkey", req.body.remember_me ? null : { expiresIn: '1d' });
      res.status(200).send({ token: token });
    } else {
      res.sendStatus(401);
    }
  }).catch(() => {
    res.sendStatus(403);
  });
});

router.post('/auth/verify', (req, res) => {
  jwt.verify(req.body.token, "testkey", (err, decoded) => {
    if (err) {
      res.sendStatus(401);
    } else {
      res.sendStatus(200);
    }
  });
});

// Begin blog post API

router.get('/post', authenticated, (req, res, next) => {
  let limit = 5;
  let offset = 0;
  req.query.limit ? limit = parseInt(req.query.limit) : null;
  req.query.page ? offset = (parseInt(req.query.page) - 1) * limit : null;
  cachedPost.findAndCountAll({
    limit: limit,
    offset: offset,
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
    cachedPostRes.total_pages = Math.ceil(cachedPostRes.count / limit);
    res.status(200).send(cachedPostRes);
  });
});

router.get('/post/published', (req, res, next) => {
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
    res.status(200).send(cachedPostRes);
  });
});

router.get('/post/published/:path', (req, res, next) => {
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
    res.status(200).send(cachedPostRes);
  }).catch((error) => {
    res.sendStatus(404);
  });
});

router.get('/post/:path', authenticated, (req, res, next) => {
  cachedPost.findOne({
    where: {
      path: req.params.path,
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
    res.status(200).send(cachedPostRes);
  }).catch((error) => {
    res.sendStatus(404);
  });
});

router.post('/post', authenticated, (req, res, next) => {
  Site.findOne().then((cachedSiteRes) => {
    User.findOne().then((cachedUserRes) => {
      Post.create({
        title: req.body.title,
        content: req.body.content,
        rendered: markdown.render(req.body.content),
        excerpt: excerpter(req.body.content),
        draft: req.body.draft ? true : false,
        path: slug(req.body.title, { lower: true }),
        url: '/p/' + slug(req.body.title, { lower: true }),
        createdAt: req.body.createdAt,
        UserId: cachedUserRes.id,
        SiteId: cachedSiteRes.id,
      }).then((result) => {
        res.location(locations.post + result.path);
        res.status(201).send(result);
      }).catch((error) => {
        res.sendStatus(409);
      });
    }).catch((error) => {
      res.sendStatus(500);
    });
  }).catch((error) => {
    res.sendStatus(500);
  });
});

router.put('/post/:path', authenticated, (req, res, next) => {
  Post.update({
    title: req.body.title,
    content: req.body.content,
    rendered: markdown.render(req.body.content),
    excerpt: excerpter(req.body.content),
    draft: req.body.draft ? true : false,
    path: slug(req.body.title, { lower: true }),
    url: '/p/' + slug(req.body.title, { lower: true }),
    createdAt: req.body.createdAt
  }, {
    where: {
      path: req.params.path, 
    },
    rejectOnEmpty: true
  }).then((result) => {
    res.send(result);
  }).catch((error) => {
    Site.findOne().then((cachedSiteRes) => {
      User.findOne().then((cachedUserRes) => {
        Post.create({
          title: req.body.title,
          content: req.body.content,
          rendered: markdown.render(req.body.content),
          excerpt: excerpter(req.body.content),
          draft: req.body.draft ? true : false,
          path: slug(req.body.title, { lower: true }),
          url: '/p/' + slug(req.body.title, { lower: true }),
          UserId: cachedUserRes.id,
          SiteId: cachedSiteRes.id,
        }).then((result) => {
          res.statusStatus(201);
        }).catch((error) => {
          res.sendStatus(409);
        });
      }).catch((error) => {
        res.sendStatus(500);
      });
    }).catch((error) => {
      res.sendStatus(500);
    });
  });
});

router.delete('/post/:path', authenticated, (req, res, next) => {
  Post.destroy({
    where: {
      path: req.params.path,
    }
  }).then((result) => {
    res.sendStatus(200);
  }).catch((error) => {
    res.sendStatus(404);
  });
});

router.get('/user', authenticated, (req, res, next) => {
  User.findOne({
    attributes: {
      exclude: ['password']
    }
  }).then((user) => {
    res.send(user);
  }).catch((error) => {
    res.send(error);
  });
});

router.put('/user', authenticated, (req, res, next) => {
  User.findOne().then((user) => {
    let password = user.password;
    if (req.body.password && user.validPassword(req.body.password)) {
      if (req.body.newPassword) {
        password = User.generateHash(req.body.newPassword);
      }
    }
    user.update({
      username: req.body.username,
      name: req.body.name,
      email: req.body.email,
      password: password,
    }).then((response) => {
      res.send(response);
    }).catch((error) => {
      res.send(error);
    });
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

router.post('/image', authenticated, image_upload.single('image'), (req, res, next) => {
  console.log(req.body);
  console.log(req.file);
  let postId = req.body.postId ? req.body.postId : null;
  Image.create({
    path: '/' + req.file.path,
    file_name: req.file.filename,
    file_path: path.resolve(req.file.destination + req.file.filename),
    PostId: postId
  }).then((response) => {
    res.send(response);
  }).catch(() => {
    res.sendStatus(400);
  });
});

router.delete('/image/:id', authenticated, (req, res, next) => {
  Image.findOne({
    where: {
      id: req.params.id
    },
    rejectOnEmpty: true
  }).then((image) => {
    fs.unlinkAsync(image.file_path).then(() => {
      image.destroy().then(() => {
        res.sendStatus(200);
      }).catch((error) => {
        res.sendStatus(500);
      });
    }).catch(() => {
      res.sendStatus(500);
    });
  }).catch((error) => {
    res.sendStatus(404);
  });
});

// Begin site API

router.get('/site', (req, res, next) => {
  cachedSite.findOne().then((cachedSiteRes) => {
    res.send(cachedSiteRes);
  }).catch((error) => {
    res.sendStatus(500);
  });
});

// Begin page API

router.get('/page/published', (req, res, next) => {
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

router.get('/page/published/:path', (req, res, next) => {
  Page.findOne({
    where: {
      path: req.params.path,
      draft: false
    },
    rejectOnEmpty: true
  }).then((page) => {
    res.send(page);
  });
});

router.get('/page', authenticated, (req, res, next) => {
  Page.findAll().then((pages) => {
    res.send(pages);
  }).catch((error) => {
    res.send(error);
  });
});

router.get('/page/:path', authenticated, (req, res, next) => {
  Page.findOne({
    rejectOnEmpty: true
  }).then((page) => {
    res.send(page);
  });
});

router.delete('/page/:path', authenticated, (req, res, next) => {
  Page.destroy({
    where: {
      path: req.params.path
    }
  }).then(() => {
    res.sendStatus(200);
  }).catch((error) => {
    res.sendStatus(400);
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
      res.location(locations.page + result.path);
      res.status(200).send(result);
    }).catch(() => {
      res.send(409);
    });
  }).catch(() => {
    res.send(500);
  });
});

router.get('*', (req, res) => {
  res.sendStatus(404);
});

export default router;
