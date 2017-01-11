module.exports = function(sequelize, DataTypes) {
  return sequelize.define('image', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 , primaryKey: true },
    name: DataTypes.STRING,
    // Path is for server use
    path: DataTypes.STRING,
    // Destination + filename is for fs operations
    filename: DataTypes.STRING,
    destination: DataTypes.STRING,
  });
}
