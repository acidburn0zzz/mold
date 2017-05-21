import {Router} from 'express'
import {Page, Post, Site, User, Image} from '../../models'
import {cachedPage, cachedPost, cachedSite, cachedUser, cachedImage} from '../../models/cached'
import path from 'path'
import jwt from 'jsonwebtoken'
import {imageUpload} from '../../config/multer'
import passport from '../../config/passport'
import Promise from 'bluebird'
import * as validations from './validations'

let env = process.env.NODE_ENV || 'development'
let config = require('../../config/config.json')[env]
const fs = Promise.promisifyAll(require('fs'))

let router = Router()

function getPostQueryParams (query) {
  return Object.freeze({
    limit: query.limit ? parseInt(query.limit) : 5,
    get offset () {
      return query.page ? (parseInt(query.page) - 1) * this.limit : 0
    }
  })
}

const locations = {
  post: '/api/v1/post/published/',
  page: '/api/v1/page/published/',
  image: '/api/v1/image/'
}

// const authenticated = (req, res, next) => { return next() };
const authenticated = passport.authenticate('jwt', { session: false })
const localAuthentication = passport.authenticate('local', { session: false })

router.post('/auth', localAuthentication, (req, res) => {
  const token = jwt.sign({ id: req.user.id }, config.jwt_key, req.body.remember_me ? null : { expiresIn: '1d' })
  res.status(200).send({ token: token })
})

router.post('/auth/verify', authenticated, (req, res, next) => {
  res.sendStatus(200)
})

// Begin blog post API

router.get('/post', authenticated, (req, res, next) => {
  const queryParams = getPostQueryParams(req.query)
  cachedPost.findAndCountAll({
    limit: queryParams.limit,
    offset: queryParams.offset,
    order: [
      ['createdAt', 'DESC']
    ],
    include: [{
      model: User,
      attributes: {
        exclude: User.defaultExcludeAttributes()
      }
    }, {
      model: Image
    }, {
      model: Site,
      attributes: {
        exclude: Site.defaultExcludeAttributes()
      }
    }]
  }).then((cachedPostRes) => {
    cachedPostRes.total_pages = Math.ceil(cachedPostRes.count / queryParams.limit)
    res.status(200).send(cachedPostRes)
  })
})

router.get('/post/published', (req, res, next) => {
  const queryParams = getPostQueryParams(req.query)
  cachedPost.findAndCountAll({
    limit: queryParams.limit,
    offset: queryParams.offset,
    where: {
      draft: false
    },
    order: [
      ['createdAt', 'DESC']
    ],
    include: [{
      model: User,
      attributes: {
        exclude: User.defaultExcludeAttributes()
      }
    }, {
      model: Image
    }, {
      model: Site,
      attributes: {
        exclude: Site.defaultExcludeAttributes()
      }
    }]
  }).then((cachedPostRes) => {
    cachedPostRes.total_pages = Math.ceil(cachedPostRes.count / queryParams.limit)
    res.status(200).send(cachedPostRes)
  })
})

router.get('/post/published/:path', (req, res, next) => {
  cachedPost.findOne({
    where: {
      path: req.params.path,
      draft: false
    },
    include: [{
      model: User,
      attributes: {
        exclude: User.defaultExcludeAttributes()
      }
    }, {
      model: Image
    }, {
      model: Site,
      attributes: {
        exclude: Site.defaultExcludeAttributes()
      }
    }],
    rejectOnEmpty: true
  }).then((cachedPostRes) => {
    res.status(200).send(cachedPostRes)
  }).catch(() => {
    res.sendStatus(404)
  })
})

router.get('/post/:path', authenticated, (req, res, next) => {
  cachedPost.findOne({
    where: {
      path: req.params.path
    },
    include: [{
      model: User,
      attributes: {
        exclude: User.defaultExcludeAttributes()
      }
    }, {
      model: Image
    }, {
      model: Site,
      attributes: {
        exclude: Site.defaultExcludeAttributes()
      }
    }],
    rejectOnEmpty: true
  }).then((cachedPostRes) => {
    res.status(200).send(cachedPostRes)
  }).catch(() => {
    res.sendStatus(404)
  })
})

router.post('/post', authenticated, validations.validatePostData, (req, res, next) => {
  Site.findOne({
    include: [{ model: User }]
  }).then((cachedSiteRes) => {
    Post.create(
      Post.new(req.body, cachedSiteRes.User, cachedSiteRes)
    ).then((result) => {
      res.location(locations.post + result.path)
      res.status(201).send(result)
    }).catch(() => {
      res.sendStatus(409)
    })
  }).catch(() => {
    res.sendStatus(500)
  })
})

router.put('/post/:path', authenticated, validations.validatePostData, (req, res, next) => {
  Post.findOne({
    where: {
      path: req.params.path
    },
    rejectOnEmpty: true
  }).then((post) => {
    post.update(Post.update(req.body)).then(() => {
      res.sendStatus(204)
    })
  }).catch(() => {
    cachedSite.findOne({
      include: [{ model: User }]
    }).then((cachedSiteRes) => {
      Post.create(
        Post.new(req.body, cachedSiteRes.User, cachedSiteRes)
      ).then(() => {
        res.sendStatus(201)
      }).catch(() => {
        res.sendStatus(409)
      })
    })
  })
})

router.delete('/post/:path', authenticated, (req, res, next) => {
  Post.destroy({
    where: {
      path: req.params.path
    }
  }).then((result) => {
    res.sendStatus(200)
  }).catch(() => {
    res.sendStatus(404)
  })
})

router.get('/user', authenticated, (req, res, next) => {
  User.findOne({
    attributes: {
      exclude: ['password']
    }
  }).then((user) => {
    res.send(user)
  }).catch((error) => {
    res.send(error)
  })
})

router.put('/user', authenticated, (req, res, next) => {
  User.findOne().then((user) => {
    let password = user.password
    if (req.body.password && user.validPassword(req.body.password)) {
      if (req.body.newPassword) {
        password = User.generateHash(req.body.newPassword)
      }
    }
    user.update({
      username: req.body.username,
      name: req.body.name,
      email: req.body.email,
      password: password
    }).then((response) => {
      res.send(response)
    }).catch((error) => {
      res.send(error)
    })
  })
})

router.get('/user/posts', (req, res, next) => {
  cachedUser.findOne({
    attributes: {
      exclude: User.defaultExcludeAttributes()
    },
    include: [{
      model: Post,
      where: {
        draft: false
      }
    }]
  }).then((user) => {
    res.send(user)
  }).catch((err) => {
    res.send(err)
  })
})

// Begin image api

router.get('/image', (req, res, next) => {
  cachedImage.findAll().then((images) => {
    res.send(images)
  }).catch((error) => {
    res.send(error)
  })
})

router.get('/image/:id', (req, res, next) => {
  cachedImage.findOne({
    where: {
      id: req.params.id
    },
    rejectOnEmpty: true
  }).then((image) => {
    res.send(image)
  }).catch((error) => {
    res.send(error)
  })
})

router.get('/image/file/:file_name', (req, res, next) => {
  cachedImage.findOne({
    where: {
      file_name: req.params.file_name
    },
    rejectOnEmpty: true
  }).then((image) => {
    res.sendFile(image.file_path)
  }).catch((error) => {
    res.send(error)
  })
})

router.post('/image', authenticated, imageUpload.single('image'), (req, res, next) => {
  let postId = req.body.postId ? req.body.postId : null
  Image.create({
    path: '/' + req.file.path,
    file_name: req.file.filename,
    file_path: path.resolve(req.file.destination + req.file.filename),
    PostId: postId
  }).then((response) => {
    res.send(response)
  }).catch(() => {
    res.sendStatus(400)
  })
})

router.delete('/image/:id', authenticated, (req, res, next) => {
  Image.findOne({
    where: {
      id: req.params.id
    },
    rejectOnEmpty: true
  }).then((image) => {
    fs.unlinkAsync(image.file_path).then(() => {
      image.destroy().then(() => {
        res.sendStatus(200)
      }).catch(() => {
        res.sendStatus(500)
      })
    }).catch(() => {
      res.sendStatus(500)
    })
  }).catch(() => {
    res.sendStatus(404)
  })
})

// Begin site API

router.get('/site', (req, res, next) => {
  cachedSite.findOne().then((cachedSiteRes) => {
    res.status(200).send(cachedSiteRes)
  }).catch(() => {
    res.sendStatus(500)
  })
})

router.put('/site', authenticated, (req, res) => {
  Site.findOne().then((site) => {
    site.update({
      name: req.body.name
    }).then(() => {
      res.sendStatus(200)
    }).catch(() => {
      res.sendStatus(500)
    })
  })
})

// Begin page API

router.get('/page/published', (req, res, next) => {
  Page.findAll({
    where: {
      draft: false
    }
  }).then((pages) => {
    res.send(pages)
  }).catch(() => {
    res.sendStatus(500)
  })
})

router.get('/page/published/:path', (req, res, next) => {
  Page.findOne({
    where: {
      path: req.params.path,
      draft: false
    },
    rejectOnEmpty: true
  }).then((page) => {
    res.send(page)
  })
})

router.get('/page', authenticated, (req, res, next) => {
  cachedPage.findAll().then((pages) => {
    res.send(pages)
  }).catch((error) => {
    res.send(error)
  })
})

router.get('/page/:path', authenticated, (req, res, next) => {
  cachedPage.findOne({
    where: {
      path: req.params.path
    },
    rejectOnEmpty: true
  }).then((page) => {
    res.send(page)
  })
})

router.delete('/page/:path', authenticated, (req, res, next) => {
  Page.destroy({
    where: {
      path: req.params.path
    }
  }).then(() => {
    res.sendStatus(200)
  }).catch(() => {
    res.sendStatus(400)
  })
})

router.post('/page', authenticated, validations.validatePageData, (req, res, next) => {
  cachedSite.findOne().then((cachedSiteRes) => {
    Page.create(
      Page.new(req.body, cachedSiteRes)
    ).then((result) => {
      res.location(locations.page + result.path)
      res.status(200).send(result)
    }).catch(() => {
      res.send(409)
    })
  }).catch(() => {
    res.send(500)
  })
})

router.put('/page/:path', authenticated, validations.validatePageData, (req, res, next) => {
  Page.findOne({
    where: {
      path: req.params.path
    },
    rejectOnEmpty: true
  }).then((page) => {
    page.update(Page.update(req.body)).then(() => {
      res.sendStatus(204)
    })
  }).catch(() => {
    cachedSite.findOne().then((cachedSiteRes) => {
      Page.create(
        Page.new(req.body, cachedSiteRes)
      ).then(() => {
        res.sendStatus(201)
      }).catch(() => {
        res.sendStatus(409)
      })
    })
  })
})

router.get('*', (req, res) => {
  res.sendStatus(404)
})

export default router
