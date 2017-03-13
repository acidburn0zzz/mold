'use strict';
module.exports = function(sequelize, DataTypes) {
  var Post = sequelize.define('Post', {
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    rendered: DataTypes.TEXT,
    excerpt: DataTypes.TEXT,
    draft: DataTypes.BOOLEAN,
    url: DataTypes.STRING,
  }, {
    classMethods: {
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
