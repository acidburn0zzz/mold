'use strict'
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('Images', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()')
      },
      path: {
        type: Sequelize.STRING
      },
      file_name: {
        type: Sequelize.STRING
      },
      file_path: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      PostId: {
        allowNull: true,
        type: Sequelize.UUID
      }
    })
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('Images')
  }
}
