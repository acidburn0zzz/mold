process.env['NODE_ENV'] = 'test';

import chai from 'chai';
import chaiHttp from 'chai-http';
import {app} from '../app';
import {User, Post, Page, Site, Image, sequelize} from '../../models';
import jwt from 'jsonwebtoken';
let should = chai.should();
let expect = chai.expect;
let assert = chai.assert;

chai.use(chaiHttp);

describe('Model Functions', () => {
  describe('Post functions', () => {
    it('Post.new should return an object with fields set', () => {
      let date = Date();
      let post = Post.new({ title: "Test", content: "Test content", draft: false, createdAt: date }, { id: 1 }, { id: 1 });
      assert.typeOf(post, "object");
      expect(post).to.have.property("title").equal("Test");
      expect(post).to.have.property("draft").equal(false);
      expect(post).to.have.property("createdAt").equal(date);
      expect(post).to.have.property("url").equal("/p/test");
    });
  });

  describe('Page functions', () => {
    it('Page.new should return an object with fields set', () => {
      let page = Page.new({ title: "Test", content: "Test content", draft: true }, { id: 1 });
      assert.typeOf(page, "object");
    });
  });
});

describe('v1 API', () => {
  before(() => {
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
          Post.create(
            Post.new({
              title: "Test Post",
              content: "Test body content with `some` markdown",
              draft: false,
              createdAt: new Date(),
            }, user, site)).then(() => {
              Post.create(
                Post.new({
                  title: "Test Draft Post",
                  content: "Test body content with `some` markdown",
                  draft: true,
                  createdAt: new Date(),
                }, user, site));
            });
        });
      });
    });
  });

  describe('Post', () => {
    let token = jwt.sign({ id: 1 }, "testkey");
    it('GET /api/v1/post should be unauthorized', (done) => {
      chai.request(app).get('/api/v1/post')
        .end((err, res) => {
          res.status.should.equal(401);
          done();
        });
    });

    it('GET /api/v1/post/published should return an array of public posts', (done) => {
      chai.request(app).get('/api/v1/post/published')
        .end((err, res) => {
          expect(res).to.have.status(200);
          res.should.be.json;
          res.body.rows.should.be.array;
          res.body.rows.length.should.equal(1);
          res.body.rows[0].draft.should.equal(false);
          done();
        });
    });

    it('GET /api/v1/post should return an array', (done) => {
      chai.request(app).get('/api/v1/post')
        .set('Authorization', "JWT " + token)
        .end((err, res) => {
          expect(res).to.have.status(200);
          res.should.be.json;
          res.body.rows.should.be.array;
          res.body.rows.length.should.equal(2);
          res.body.rows[0].draft.should.equal(true);
          done();
        });
    });
  });

  describe('Site', () => {
    it('GET /api/v1/site should return a JSON object', (done) => {
      chai.request(app).get('/api/v1/site')
      .end((err, res) => {
        res.should.be.json;
        res.body.name.should.equal("Test Site");
        expect(res).to.have.status(200);
        done();
      });
    });
  });
});
