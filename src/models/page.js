module.exports = function(sequelize, DataTypes) {
  return sequelize.define('page', {
    url: DataTypes.STRING,
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    rendered: DataTypes.TEXT,
  })
}
