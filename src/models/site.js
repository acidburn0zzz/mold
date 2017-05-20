export default function(sequelize, DataTypes) {
  return sequelize.define('Site', {
    name: DataTypes.STRING,
    initialized: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        this.hasMany(models.Page);
        this.hasOne(models.User);
      },
      defaultExcludeAttributes: function() {
        return ['id', 'initialized', 'createdAt', 'updatedAt'];
      },
    }
  });
};
