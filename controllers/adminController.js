const db = require('../models')

const Product = db.Product
const Category = db.Category
const User = db.User
const Payment = db.Payment
const Order = db.Order
const Population = db.Population
const pageLimit = 10
// const Sequelize = require('sequelize');
// const Op = Sequelize.Op

const adminController = {
  getIndex: (req, res) => {
    return Payment.findAll({
      include: [{
        model: Order,
        include: [{
          model: User,
        }]
      }]
    }).then((payments) => {
      payments = payments.map(payment => ({
        ...payment.dataValues,

      }))
      orders = payments.map(payment => ({
        ...payment.Order.dataValues,
      }))
      users = orders.map(order => ({
        ...order.User.dataValues,
      }))
      console.log(payments)
      console.log('#######')
      console.log(orders)
      console.log('#######')
      console.log(users)
      return res.render('admin/index', { payments: payments })
    })

  }
}
module.exports = adminController




