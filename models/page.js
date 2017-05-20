'use strict';

import markdown from '../src/config/markdown';
import slug from 'slug';

module.exports = function(sequelize, DataTypes) {
  var Page = sequelize.define('Page', {
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    rendered: DataTypes.STRING,
    draft: DataTypes.BOOLEAN,
    path: DataTypes.STRING,
    url: DataTypes.STRING
  }, {
    classMethods: {
      new: function(body, site) {
        return {
          title: body.title,
          content: body.content,
          rendered: markdown.render(body.content),
          draft: body.draft ? true : false,
          path: slug(body.title, { lower: true }),
          url: '/s/' + slug(body.title, { lower: true }),
          SiteId: site.id
        };
      },
      update: function(body) {
        return {
          title: body.title,
          content: body.content,
          rendered: markdown.render(body.content),
          draft: body.draft ? true : false,
          path: slug(body.title, { lower: true }),
          url: '/s/' + slug(body.title, { lower: true }),
        };
      },
      associate: function(models) {
        Page.belongsTo(models.Site, {
          foreignKey: {
            allowNull: false
          }
        });
      }
    }
  });
  return Page;
};
