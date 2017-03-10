'use strict';
module.exports = function(sequelize, DataTypes) {
  var Site = sequelize.define('Site', {
    name: DataTypes.STRING,
    initialized: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Site;
};