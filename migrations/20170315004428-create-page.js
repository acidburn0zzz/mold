'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Pages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      content: {
        type: Sequelize.STRING
      },
      rendered: {
        type: Sequelize.STRING
      },
      draft: {
        type: Sequelize.BOOLEAN
      },
      path: {
        type: Sequelize.STRING
      },
      url: {
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
      SiteId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Sites',
          key: 'id'
        }
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Pages');
  }
};
