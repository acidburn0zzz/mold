'use strict';
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
