export default function (sequelize, DataTypes) {
  return sequelize.define('Image', {
    path: DataTypes.STRING,
    file_name: DataTypes.STRING,
    file_path: DataTypes.STRING
  }, {
    classMethods: {
      associate: function (models) {
      }
    }
  })
};
