const db = require('../models')
const Order = db.Order
const OrderItem = db.OrderItem
const Cart = db.Cart
const CartItem = db.CartItem

let orderController = {
  getOrders: (req, res) => {
    Order.findAll({ include: 'items' }).then(orders => {
      return res.render('orders', {
        orders
      })
    })
  },
  postOrder: (req, res) => {

    console.log(req.body.cartId)
    //1 get cart
    return Cart.findByPk(req.body.cartId, { include: 'items' }).then(cart => {

      //2 create order
      Order.create({
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address,
        amount: req.body.amount,
        shipping_status: req.body.shipping_status,
        payment_status: req.body.payment_status,
        // UserId: 0,
      }).then(order => {
        //3 copy cart to order

        var results = []
        for (var i = 0; i < cart.items.length; i++) {
          console.log(order.id, cart.items[i].id)

          results.push(
            OrderItem.create({
              OrderId: order.id,
              ProductId: cart.items[i].id,
              price: cart.items[i].price,
              quantity: cart.items[i].CartItem.quantity,
            })
          )

        }
        return Promise.all(results).then(() => {
          res.redirect('/orders')
        })


      })
    })
  },
  cancelOrder: (req, res) => {
    Order.findByPk(req.params.id).then(order => {
      order.update({
        shipping_status: "-1",
        payment_status: "-1"
      }).then(() => {
        return res.redirect('back')
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
