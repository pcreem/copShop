'use strict';
const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Farmers',
      Array.from({ length: 10 }).map((item, index) =>
        ({
          id: index + 1,
          name: faker.internet.userName(),
          email: faker.internet.exampleEmail(),
          tel: faker.phone.phoneNumber(),
          address: faker.address.streetAddress(),
          line: faker.commerce.productName(),
          createdAt: new Date(),
          updatedAt: new Date()
        })
      ), {});

  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Farmers', null, {});
  }
};
