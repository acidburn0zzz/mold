import bcrypt from 'bcrypt';

export default function(sequelize, DataTypes) {
  return sequelize.define('User', {
    name: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
  }, {
    classMethods: {
      generateHash: function(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(), null);
      },
      associate: function(models) {
        this.belongsTo(models.Site, {
          foreignKey: {
            allowNull: false
          }
        });
        this.hasMany(models.Post);
      },
      defaultExcludeAttributes: function() {
        return [
          'id', 'username', 'password', 'createdAt', 'updatedAt', 'SiteId'
        ];
      }
    },
    instanceMethods: {
      validPassword: function(password) {
        return bcrypt.compareSync(password, this.password);
      },
    },
  });
};
