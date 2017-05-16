process.env['NODE_ENV'] = 'test';

import chai from 'chai';
import chaiHttp from 'chai-http';
import {app} from '../app';
import {User, Post, Page, Site, Image, sequelize} from '../../models';
import jwt from 'jsonwebtoken';
let config = require('../../config/config.json')['test'];
let should = chai.should();
let expect = chai.expect;
let assert = chai.assert;

chai.use(chaiHttp);

describe('Model Functions', function() {
  describe('Post', function() {
    it('Post.new() should return an object with fields set', function() {
      let date = Date();
      let post = Post.new({ title: "Test", content: "Test content", draft: false, createdAt: date }, { id: 1 }, { id: 1 });
      assert.typeOf(post, "object");
      expect(post).to.have.property("title").equal("Test");
      expect(post).to.have.property("draft").equal(false);
      expect(post).to.have.property("createdAt").equal(date);
      expect(post).to.have.property("url").equal("/p/test");
    });
  });

  describe('Page', function() {
    it('Page.new() should return an object with fields set', function() {
      let page = Page.new({ title: "Test", content: "Test content", draft: true }, { id: 1 });
      assert.typeOf(page, "object");
    });
  });
});

describe('v1 API', function() {
  before(function() {
    return sequelize.sync({ force: true }).then(() => {
      Site.create({
        name: "Test Site",
        initialized: true,
      }).then((site) => {
        User.create({
          name: "Test User",
          username: "test_user",
          password: User.generateHash("password"),
          email: "test@test.com",
          google_id: "",
          google_token: "",
          SiteId: site.id
        }).then((user) => {
          for (let i = 1; i <= 5; i++) {
            Post.create(
              Post.new({
                title: `Test Post ${i}`,
                content: "Test body content with `some` markdown",
                draft: false,
                createdAt: new Date()
              }, user, site)
            ).then();
          }
          for (let i = 5; i <= 10; i++) {
            Post.create(
              Post.new({
                title: `Test Post ${i}`,
                content: "Test body content with `some` markdown",
                draft: true,
                createdAt: new Date()
              }, user, site)
            ).then();
          }
        });
      });
    });
  });

  describe('Auth', function() {
    it('POST /auth with invalid username + password', function() {
      return chai.request(app).post('/api/v1/auth')
        .field('username', 'ayyy')
        .field('password', 'hi')
        .catch((err) => {
          err.status.should.equal(400);
        });
    });

    it('POST /auth with valid username + password', function() {
      return chai.request(app).post('/api/v1/auth')
        .send({ username: "test_user", password: "password" })
        .then((res) => {
          res.status.should.equal(200);
        });
    });

    it('POST /auth with valid username, invalid password', function() {
      return chai.request(app).post('/api/v1/auth')
        .send({ username: "test_user", password: "hi" })
        .catch((err) => {
          err.status.should.equal(401);
        });
    });

    it('POST /auth/verify with valid token, valid payload', function() {
      let token = jwt.sign({ id: 1 }, config.jwt_key);
      return chai.request(app).post('/api/v1/auth/verify')
        .set('Authorization', `JWT ${token}`)
        .then((res) => {
          res.status.should.equal(200);
        });
    });

    it('POST /auth/verify with valid token, invalid payload', function() {
      let token = jwt.sign({ id: 10 }, config.jwt_key);
      return chai.request(app).post('/api/v1/auth/verify')
        .send({ token: token })
        .catch((err) => {
          err.status.should.equal(401);
        });
    });

    it('POST /auth/verify with invalid token', function() {
      let token = jwt.sign({ id: 1 }, "garbage");
      return chai.request(app).post('/api/v1/auth/verify')
        .set('Authorization', "JWT " + token)
        .catch((err) => {
          err.status.should.equal(401);
        });
    });
  });

  describe('Post', function() {
    const token = jwt.sign({ id: 1 }, config.jwt_key);
    it('GET /api/v1/post should return 401 without a JWT', function() {
      return chai.request(app).get('/api/v1/post')
        .catch((err) => {
          err.status.should.equal(401);
        });
    });

    it('GET /api/v1/post should return an array with valid JWT', function() {
      return chai.request(app).get('/api/v1/post')
        .set('Authorization', "JWT " + token)
        .then((res) => {
          expect(res).to.have.status(200);
          res.should.be.json;
          res.body.rows.should.be.array;
          res.body.rows.length.should.equal(5);
          res.body.rows[1].draft.should.equal(true);
        });
    });

    it('GET /api/v1/post should return 401 with an invalid JWT', function() {
      let token = jwt.sign({ id: 1 }, "garbage");
      return chai.request(app).get('/api/v1/post')
        .set('Authorization', "JWT " + token)
        .catch((err) => {
          expect(err).to.have.status(401);
        });
    });

    it('GET /api/v1/post/published should return an array of public posts', function() {
      return chai.request(app).get('/api/v1/post/published')
        .then((res) => {
          expect(res).to.have.status(200);
          res.should.be.json;
          res.body.rows.should.be.array;
          res.body.rows.length.should.equal(5);
          res.body.rows[0].draft.should.equal(false);
        });
    });

    it('GET /api/v1/post/published should return an array of public posts with limit = 2', function() {
      return chai.request(app).get('/api/v1/post/published?limit=2')
        .then((res) => {
          expect(res).to.have.status(200);
          res.should.be.json;
          res.body.total_pages.should.equal(3);
          res.body.rows.should.be.array;
          res.body.rows.length.should.equal(2);
          res.body.rows[0].draft.should.equal(false);
        });
    });

    it('GET /api/v1/post/published/:path should return a public post', function() {
      return chai.request(app).get('/api/v1/post/published/test-post-5')
        .then((res) => {
          expect(res).to.have.status(200);
          res.body.title.should.equal("Test Post 5");
          res.body.draft.should.equal(false);
          res.should.be.json;
        });
    });

    it('GET /api/v1/post/published/:path where :path doesn\'t exists should return a 404', function() {
      return chai.request(app).get('/api/v1/post/published/test-post-10')
        .catch((err) => {
          expect(err).to.have.status(404);
        });
    });
  });

  describe('Site', function() {
    it('GET /api/v1/site should return a JSON object', function() {
      return chai.request(app).get('/api/v1/site')
      .then((res) => {
        res.should.be.json;
        res.body.name.should.equal("Test Site");
        expect(res).to.have.status(200);
      });
    });
  });
});
