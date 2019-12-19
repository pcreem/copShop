'use strict';

const faker = require('faker')
var payStatus = ["paid", "cancel"]

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Payments',
      Array.from({ length: 5 }).map((item, index) =>
        ({
          amount: faker.random.number(),
          sn: faker.random.number(),
          payment_method: Math.floor(Math.random() * 3) + 1,
          paid_at: new Date(),
          params: payStatus[Math.floor(Math.random() * payStatus.length)],
          OrderId: Math.floor(Math.random() * 30) + 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      ), {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Payments', null, {})
  }
};
