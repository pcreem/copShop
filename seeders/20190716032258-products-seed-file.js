'use strict';

const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.bulkInsert('Categories',
      ['穀類', '豆類', '薯類', '蔬菜類', '水果類', '畜類', '禽類']
        .map((item, index) =>
          ({
            id: index + 1,
            name: item,
            createdAt: new Date(),
            updatedAt: new Date()
          })
        ), {})

    return queryInterface.bulkInsert('Products',
      Array.from({ length: 100 }).map((item, index) =>
        ({
          id: index + 1,
          name: faker.commerce.productName(),
          description: faker.commerce.product() + '/' + faker.commerce.productName(),
          price: Math.round(faker.commerce.price()),
          image: faker.image.imageUrl(),
          createdAt: new Date(),
          updatedAt: new Date(),
          CategoryId: Math.floor(Math.random() * 5) + 1,
          PopulationId: Math.floor(Math.random() * 10) + 1
        })
      ), {})
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('Categories', null, {})
    return queryInterface.bulkDelete('Products', null, {})
  }
};
