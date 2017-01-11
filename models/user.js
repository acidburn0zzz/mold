const bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    name: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    google_id: DataTypes.STRING,
    google_token: DataTypes.STRING,
    display_picture: DataTypes.STRING,
  }, {
    classMethods: {
      generateHash: function(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(), null);
      },
    },
    instanceMethods: {
      validPassword: function(password) {
        return bcrypt.compareSync(password, this.password);
      },
    },
  });
}
