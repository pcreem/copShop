const db = require('../models')
const Order = db.Order

let orderController = {
  getOrders: (req, res) => {
    Order.findAll({ include: 'items' }).then(orders => {
      return res.render('orders', {
        orders
      })
    })
  },
}

module.exports = orderController



// findAll({ include: 'items' })
//也可以這樣寫
/*
findAll({
      include:
        [
          {
            model: Product,
            as: "items"
          }
        ]
    })
    */
