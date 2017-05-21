/* eslint-env mocha */

import chai from 'chai'
import chaiHttp from 'chai-http'
import {app} from '../app'
import {User, Post, Page, Site, sequelize} from '../models'
import jwt from 'jsonwebtoken'
require('must/register')
process.env['NODE_ENV'] = 'test'
let config = require('../config/config.json')['test']

chai.use(chaiHttp)

const BAD_TOKEN = jwt.sign({ id: 1 }, 'garbage')
const INVALID_TOKEN = jwt.sign({ id: 1 }, config.jwt_key)
const VALID_TOKEN = jwt.sign({ id: 1 }, config.jwt_key)

describe('Model Functions', function () {
  describe('Post', function () {
    it('Post.new() should return an object with fields set', function () {
      const date = Date()
      let post = Post.new({ title: 'Test', content: 'Test content', draft: false, createdAt: date }, { id: 1 }, { id: 1 })
      post.must.be.a.object()
      post.must.have.property('title', 'Test')
      post.must.have.property('draft', false)
      post.must.have.property('createdAt', date)
      post.must.have.property('url', '/p/test')
    })
  })

  describe('Page', function () {
    it('Page.new() should return an object with fields set', function () {
      let page = Page.new({ title: 'Test', content: 'Test content', draft: true }, { id: 1 })
      page.must.be.a.object()
      page.must.have.property('title', 'Test')
      page.must.have.property('draft', true)
      page.must.have.property('content', 'Test content')
    })
  })
})

describe('v1 API', function () {
  before(function () {
    return sequelize.sync({ force: true }).then(() => {
      Site.create({
        name: 'Test Site',
        initialized: true
      }).then((site) => {
        User.create({
          name: 'Test User',
          username: 'test_user',
          password: User.generateHash('password'),
          email: 'test@test.com',
          SiteId: site.id
        }).then((user) => {
          for (let i = 1; i <= 5; i++) {
            Post.create(
              Post.new({
                title: `Test Post ${i}`,
                content: 'Test body content with `some` markdown',
                draft: false,
                createdAt: new Date()
              }, user, site)).then()
          }
          for (let i = 6; i <= 10; i++) {
            Post.create(
              Post.new({
                title: `Test Post ${i}`,
                content: 'Test body content with `some` markdown',
                draft: true,
                createdAt: new Date()
              }, user, site)).then()
          }
        })
        Page.create(
          Page.new({
            title: 'Test Page 1',
            content: 'Test body content for `pages`',
            draft: false
          }, site)).then(
            Page.create(
              Page.new({
                title: 'Test Page 2',
                content: 'Test body content for `pages`',
                draft: true
              }, site)).then()
          )
      })
    })
  })

  describe('Auth', function () {
    it('POST /auth with invalid username + password', function () {
      return chai.request(app).post('/api/v1/auth')
        .field('username', 'ayyy')
        .field('password', 'hi')
        .catch((err) => {
          err.status.must.equal(400)
        })
    })

    it('POST /auth with valid username + password', function () {
      return chai.request(app).post('/api/v1/auth')
        .send({ username: 'test_user', password: 'password' })
        .then((res) => {
          res.body.token.must.exist()
          res.status.must.equal(200)
        })
    })

    it('POST /auth with valid username, invalid password', function () {
      return chai.request(app).post('/api/v1/auth')
        .send({ username: 'test_user', password: 'hi' })
        .catch((err) => {
          err.status.must.equal(401)
        })
    })

    it('POST /auth/verify with valid token, valid payload', function () {
      return chai.request(app).post('/api/v1/auth/verify')
        .set('Authorization', 'JWT ' + VALID_TOKEN)
        .then((res) => {
          res.status.must.equal(200)
        })
    })

    it('POST /auth/verify with valid token, invalid payload', function () {
      return chai.request(app).post('/api/v1/auth/verify')
        .set('Authorization', 'JWT ' + INVALID_TOKEN)
        .catch((err) => {
          err.status.must.equal(401)
        })
    })

    it('POST /auth/verify with invalid token', function () {
      return chai.request(app).post('/api/v1/auth/verify')
        .set('Authorization', 'JWT ' + BAD_TOKEN)
        .catch((err) => {
          err.status.must.equal(401)
        })
    })
  })

  describe('Post', function () {
    it('GET /api/v1/post should return 401 without a JWT', function () {
      return chai.request(app).get('/api/v1/post')
        .catch((err) => {
          err.status.must.equal(401)
        })
    })

    it('GET /api/v1/post should return an array with valid JWT', function () {
      return chai.request(app).get('/api/v1/post')
        .set('Authorization', 'JWT ' + VALID_TOKEN)
        .then((res) => {
          res.status.must.equal(200)
          res.body.rows.must.be.a.array()
          res.body.rows.length.must.equal(5)
          res.body.rows[1].draft.must.equal(true)
        })
    })

    it('GET /api/v1/post should return 401 with an invalid JWT', function () {
      return chai.request(app).get('/api/v1/post')
        .set('Authorization', 'JWT ' + BAD_TOKEN)
        .catch((err) => {
          err.status.must.equal(401)
        })
    })

    it('POST /api/v1/post with valid auth should return 201 with new Post content', function () {
      return chai.request(app).post('/api/v1/post')
        .set('Authorization', 'JWT ' + VALID_TOKEN)
        .send({
          title: 'Testing POST for /api/v1/post',
          content: 'Testing content! `Some markdown`',
          draft: false
        })
        .then((res) => {
          res.status.must.equal(201)
          res.body.title.must.equal('Testing POST for /api/v1/post')
          res.body.draft.must.equal(false)
          res.body.url.must.equal('/p/testing-post-for-apiv1post')
          res.body.path.must.equal('testing-post-for-apiv1post')
        })
    })

    it('POST /api/v1/post creating a post with title conflicts fails with 409', function () {
      return chai.request(app).post('/api/v1/post')
        .set('Authorization', 'JWT ' + VALID_TOKEN)
        .send({
          title: 'Testing POST for /api/v1/post',
          content: 'Testing content! `Some markdown`',
          draft: false
        })
        .catch((err) => {
          err.status.must.equal(409)
        })
    })

    it('POST /api/v1/post without proper auth should fail with 401', function () {
      return chai.request(app).post('/api/v1/post')
        .send({
          title: 'Testing POST for /api/v1/post',
          content: 'Testing content! `Some markdown`',
          draft: false
        })
        .catch((err) => {
          err.status.must.equal(401)
        })
    })

    it('PUT /api/v1/post without proper auth should fail with 401', function () {
      return chai.request(app).put('/api/v1/post/testing-post-for-apiv1post')
        .send({
          title: 'Testing PUT for /api/v1/post',
          content: 'Testing content! `Some markdown`',
          draft: false
        })
        .catch((err) => {
          err.status.must.equal(401)
        })
    })

    it('PUT /api/v1/post should pass with 204 on post update', function () {
      return chai.request(app).put('/api/v1/post/testing-post-for-apiv1post')
        .set('Authorization', 'JWT ' + VALID_TOKEN)
        .send({
          title: 'Testing PUT for /api/v1/post',
          content: 'Testing content! `Some markdown`',
          draft: false
        })
        .then((res) => {
          res.status.must.equal(204)
        })
    })

    it('PUT /api/v1/post/:path should pass with 201 on new post', function () {
      return chai.request(app).put('/api/v1/post/testing-put')
        .set('Authorization', 'JWT ' + VALID_TOKEN)
        .send({
          title: 'Testing PUT',
          content: 'Testing new content! `Some markdown`',
          draft: true
        })
        .then((res) => {
          res.status.must.equal(201)
        })
    })

    it('PUT /api/v1/post/:path with missing data should fail with 400', function () {
      return chai.request(app).put('/api/v1/post/testing-put')
        .set('Authorization', 'JWT ' + VALID_TOKEN)
        .send({
          title: '',
          content: '',
          draft: ''
        })
        .catch((err) => {
          err.status.must.equal(400)
        })
    })

    it('GET /api/v1/post/published should return an array of public posts', function () {
      return chai.request(app).get('/api/v1/post/published')
        .then((res) => {
          res.status.must.equal(200)
          res.body.rows.must.be.a.array()
          res.body.rows.length.must.equal(5)
          res.body.rows[0].draft.must.equal(false)
        })
    })

    it('GET /api/v1/post/published should return an array of public posts with limit = 2', function () {
      return chai.request(app).get('/api/v1/post/published?limit=2')
        .then((res) => {
          res.status.must.equal(200)
          res.body.rows.must.be.a.array()
          res.body.rows.length.must.equal(2)
          res.body.rows[0].draft.must.equal(false)
        })
    })

    it('GET /api/v1/post/published/:path should return a public post', function () {
      return chai.request(app).get('/api/v1/post/published/test-post-5')
        .then((res) => {
          res.status.must.equal(200)
          res.body.title.must.equal('Test Post 5')
          res.body.draft.must.equal(false)
        })
    })

    it('GET /api/v1/post/published/:path where :path doesn\'t exists should return a 404', function () {
      return chai.request(app).get('/api/v1/post/published/test-post-12')
        .catch((err) => {
          err.status.must.equal(404)
        })
    })

    it('DELETE /api/v1/post/:path where :path does not exist should return 404', function () {
      return chai.request(app).delete('/api/v1/post/test-post-12')
        .set('Authorization', 'JWT ' + VALID_TOKEN)
        .catch((err) => {
          err.status.must.equal(404)
        })
    })

    it('DELETE /api/v1/post/:path should return 200', function () {
      return chai.request(app)
        .delete('/api/v1/post/test-post-1')
        .set('Authorization', 'JWT ' + VALID_TOKEN)
        .then((res) => {
          res.status.must.equal(200)
        })
    })
  })

  describe('Page', function () {
    it('GET /api/v1/page/published should return an array of pages', function () {
      return chai.request(app).get('/api/v1/page/published')
        .then((res) => {
          res.body.must.be.a.array()
          res.status.must.equal(200)
        })
    })

    it('GET /api/v1/page/published/:path should return a public page', function () {
      return chai.request(app).get('/api/v1/page/published/test-page-1')
        .then((res) => {
          res.body.title.must.equal('Test Page 1')
          res.body.draft.must.equal(false)
          res.status.must.equal(200)
        })
    })

    it('GET /api/v1/page should return an array of pages', function () {
      return chai.request(app).get('/api/v1/page')
        .set('Authorization', 'JWT ' + VALID_TOKEN)
        .then((res) => {
          res.status.must.equal(200)
        })
    })

    it('GET /api/v1/page/:path should return a page', function () {
      return chai.request(app).get('/api/v1/page/test-page-2')
        .set('Authorization', 'JWT ' + VALID_TOKEN)
        .then((res) => {
          res.body.draft.must.equal(true)
          res.status.must.equal(200)
        })
    })

    it('POST /api/v1/page with invalid auth returns 401', function () {
      return chai.request(app).post('/api/v1/page')
        .set('Authorization', 'JWT ' + INVALID_TOKEN)
        .send({
          title: 'Testing POST for Pages',
          content: 'Testing, testing, 123',
          draft: true
        })
        .catch((err) => {
          err.status.must.equal(401)
        })
    })

    it('POST /api/v1/page with valid data + auth', function () {
      return chai.request(app).post('/api/v1/page')
        .set('Authorization', 'JWT ' + VALID_TOKEN)
        .send({
          title: 'Testing POST for Pages',
          content: 'Testing, testing, 123',
          draft: true
        })
        .then((res) => {
          res.header.location.must.equal('/api/v1/page/published/testing-post-for-pages')
          res.status.must.equal(200)
        })
    })

    it('POST /api/v1/page with missing data should return 400', function () {
      return chai.request(app).post('/api/v1/page')
        .set('Authorization', 'JWT ' + VALID_TOKEN)
        .send({
          title: '',
          content: 'Testing, testing, 123',
          draft: true
        })
        .catch((err) => {
          err.status.must.equal(400)
        })
    })

    it('PUT /api/v1/page/:path should return a 204 when updating a page', function () {
      return chai.request(app).put('/api/v1/page/testing-post-for-pages')
        .set('Authorization', 'JWT ' + VALID_TOKEN)
        .send({
          title: 'Testing PUT for Pages',
          content: 'Testing, testing, 123',
          draft: true
        }).then((res) => {
          res.status.must.equal(204)
        })
    })

    it('PUT /api/v1/page/:path should return a 401 with invalid auth', function () {
      return chai.request(app).put('/api/v1/page/testing-post-for-pages')
        .set('Authorization', 'JWT ' + INVALID_TOKEN)
        .send({
          title: 'Testing PUT for Pages',
          content: 'Testing, testing, 123',
          draft: true
        }).catch((err) => {
          err.status.must.equal(401)
        })
    })

    it('PUT /api/v1/page/:path should return a 201 when creating a page', function () {
      return chai.request(app).put('/api/v1/page/testing-pages-put')
        .set('Authorization', 'JWT ' + VALID_TOKEN)
        .send({
          title: 'Testing Pages PUT',
          content: 'Testing creating a new page via PUT',
          draft: true
        }).then((res) => {
          res.status.must.equal(201)
        })
    })

    it('DELETE /api/v1/page/:path should return 401 with invalid auth', function () {
      return chai.request(app).delete('/api/v1/page/testing-pages-put')
        .set('Authorization', 'JWT ' + INVALID_TOKEN)
        .catch((err) => {
          err.status.must.equal(401)
        })
    })

    it('DELETE /api/v1/page/:path should return 200 on successful delete', function () {
      return chai.request(app).delete('/api/v1/page/testing-pages-put')
        .set('Authorization', 'JWT ' + VALID_TOKEN)
        .then((res) => {
          res.status.must.equal(200)
        })
    })

    it('DELETE /api/v1/page/:path where :path does not exist should return 404', function () {
      return chai.request(app).delete('/api/v1/page/im-not-here')
        .set('Authorization', 'JWT ' + VALID_TOKEN)
        .catch((err) => {
          err.status.must.equal(404)
        })
    })
  })

  describe('Site', function () {
    it('GET /api/v1/site should return a JSON object', function () {
      return chai.request(app).get('/api/v1/site')
      .then((res) => {
        res.body.name.must.equal('Test Site')
        res.status.must.equal(200)
      })
    })
  })
})
