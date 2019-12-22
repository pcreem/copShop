'use strict';
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    cost: DataTypes.INTEGER,
    sn: DataTypes.INTEGER,
    shipping_status: DataTypes.STRING,
    payment_status: DataTypes.STRING,
    UserId: DataTypes.INTEGER
  }, {});
  Order.associate = function (models) {
    // associations can be defined here
    Order.belongsToMany(models.Product, {
      through: models.OrderItem,
      foreignKey: 'OrderId',
      as: 'items'
    });
    Order.belongsTo(models.User)
    Order.hasMany(models.Payment)
  };
  return Order;
};