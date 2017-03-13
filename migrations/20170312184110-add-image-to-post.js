'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('Posts', 'ImageId', {
      type: Sequelize.UUID,
      references: {
        model: 'Images',
        key: 'id'
      }
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('Posts', 'ImageId');
  }
};
