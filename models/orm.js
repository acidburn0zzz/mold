let Database = require('../config/config').Database;
let Sequelize = require('sequelize');
let ORM = new Sequelize(Database.db, Database.admin, Database.pass, {
  logging: false,
});

let Session = ORM.import('./session');
let User = ORM.import('./user');
let Post = ORM.import('./post');
let Site = ORM.import('./site');
let Page = ORM.import('./page');
let Media = ORM.import('./media');

User.belongsTo(Site);
Site.hasOne(User);

Post.belongsTo(Site);
Page.belongsTo(Site);
Site.hasMany(Page);
Site.hasMany(Post);

Post.belongsTo(User);
User.hasMany(Post);

module.exports.ORM = ORM;
module.exports.Post = Post;
module.exports.User = User;
module.exports.Site = Site;
module.exports.Media = Media;
module.exports.Page = Page;
