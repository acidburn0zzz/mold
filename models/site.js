module.exports = function(sequelize, DataTypes) {
  return sequelize.define('site', {
    name: DataTypes.STRING,
    initialized: DataTypes.BOOLEAN,
  })
}
