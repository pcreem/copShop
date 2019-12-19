'use strict';
module.exports = (sequelize, DataTypes) => {
  const Population = sequelize.define('Population', {
    population: DataTypes.STRING
  }, {});
  Population.associate = function (models) {
    Population.hasMany(models.Product)
  };
  return Population;
};