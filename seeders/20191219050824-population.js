'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.bulkInsert('Populations',
      ["泰雅", "布農", "鄒", "魯凱", "排灣", "阿美", "卑南", "太魯閣", "賽德克", "達悟"]
        .map((item, index) =>
          ({
            id: index + 1,
            population: item,
            createdAt: new Date(),
            updatedAt: new Date()
          })
        ), {})

  },

  down: (queryInterface, Sequelize) => {

    return queryInterface.bulkDelete('Populations', null, {});

  }
};
