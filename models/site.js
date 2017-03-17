'use strict';
module.exports = function(sequelize, DataTypes) {
  var Site = sequelize.define('Site', {
    name: DataTypes.STRING,
    initialized: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        Site.hasMany(models.Page);
      }
    }
  });
  Site.postDefaultExcludeAttributes = [
    'id', 'initialized', 'createdAt', 'updatedAt'
  ];
  return Site;
};
