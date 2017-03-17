'use strict';
const bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    name: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    google_id: DataTypes.STRING,
    google_token: DataTypes.STRING
  }, {
    classMethods: {
      generateHash: function(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(), null);
      },
      associate: function(models) {
        User.belongsTo(models.Site, {
          foreignKey: {
            allowNull: false
          }
        });
        User.hasMany(models.Post);
      }
    },
    instanceMethods: {
      validPassword: function(password) {
        return bcrypt.compareSync(password, this.password);
      },
    },
  });
  User.postDefaultExcludeAttributes = [
    'id', 'username', 'password', 'google_id', 'google_token', 'createdAt', 'updatedAt', 'SiteId'
  ];
  return User;
};
