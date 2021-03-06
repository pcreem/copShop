'use strict';
module.exports = (sequelize, DataTypes) => {
  const Farmer = sequelize.define('Farmer', {
    name: DataTypes.STRING,
    line: DataTypes.STRING,
    tel: DataTypes.STRING,
    address: DataTypes.STRING,
    image: DataTypes.STRING
  }, {});
  Farmer.associate = function (models) {
    // associations can be defined here
    Farmer.hasMany(models.Product)
  };
  return Farmer;
};