'use strict';

import markdown from '../config/markdown';
import slug from 'slug';

function excerpter(string) {
  let summary = new String(string);
  summary = summary.substr(0, summary.lastIndexOf(" ", 250));
  return markdown.render(summary.valueOf())
}

module.exports = function(sequelize, DataTypes) {
  var Post = sequelize.define('Post', {
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    rendered: DataTypes.TEXT,
    excerpt: DataTypes.TEXT,
    draft: DataTypes.BOOLEAN,
    path: DataTypes.STRING,
    url: DataTypes.STRING,
  }, {
    classMethods: {
      new: function(body, user, site) {
        return {
          title: body.title,
          content: body.content,
          rendered: markdown.render(body.content),
          excerpt: excerpter(body.content),
          draft: body.draft ? true : false,
          path: slug(body.title, { lower: true }),
          url: '/p/' + slug(body.title, { lower: true }),
          createdAt: body.createdAt,
          UserId: user.id,
          SiteId: site.id
        };
      },
      update: function(body) {
        return {
          title: body.title,
          content: body.content,
          rendered: markdown.render(body.content),
          excerpt: excerpter(body.content),
          draft: body.draft ? true : false,
          path: slug(body.title, { lower: true }),
          url: '/p/' + slug(body.title, { lower: true }),
          createdAt: body.createdAt,
        };
      },
      associate: function(models) {
        Post.belongsTo(models.User, {
          foreignKey: {
            allowNull: false
          }
        });
        Post.belongsTo(models.Site, {
          foreignKey: {
            allowNull: false
          }
        });
        Post.hasOne(models.Image);
      }
    }
  });
  return Post;
};
