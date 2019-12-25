const db = require('../models')
const nodemailer = require('nodemailer');

const Order = db.Order
const OrderItem = db.OrderItem
const Cart = db.Cart
const CartItem = db.CartItem

const GMAIL_ACCOUNT = process.env.GMAIL_ACCOUNT
const GMAIL_PASSWORD = process.env.GMAIL_PASSWORD

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: "login", // default
    user: GMAIL_ACCOUNT,
    pass: GMAIL_PASSWORD
  },
})

let orderController = {
  getOrders: (req, res) => {
    Order.findAll({ include: 'items' }).then(orders => {
      return res.render('orders', {
        orders
      })
    })
  },
  postOrder: (req, res) => {

    // console.log(req.body.cartId)
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
          // console.log(order.id, cart.items[i].id)

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

          if (req.user.email) {
            //目前設定必須到 Gmail 帳戶中的這頁 https://myaccount.google.com/security
            //開啟低安全性設定，以後可改成oauth2 API 串接方式較為安全。
            // https://nodemailer.com/smtp/oauth2/#oauth-3lo
            var mailOptions = {
              from: GMAIL_ACCOUNT,
              to: req.user.email,
              subject: `${order.id} 訂單成立`,
              text: `${order.id} 訂單成立`,
            }

            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log(error)
              } else {
                console.log('Email sent: ' + info.response);
              }
            })

          } else {
            console.error('Error: user email not exist!!')
          }

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
