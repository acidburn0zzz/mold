'use strict'

const bcrypt = require('bcrypt')
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [{
      name: 'User',
      username: 'user',
      password: bcrypt.hashSync('password', bcrypt.genSaltSync(), null),
      email: 'example@example.com',
      google_id: '',
      google_token: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      SiteId: 1
    }], {})
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
}
