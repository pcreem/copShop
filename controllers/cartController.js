const db = require('../models')
const Cart = db.Cart
const CartItem = db.CartItem
const PAGE_LIMIT = 10;
const PAGE_OFFSET = 0;

let cartController = {
  getCart: (req, res) => {
    return Cart.findByPk(req.session.cartId, { include: 'items' }).then(cart => {
      cart = cart || { items: [] }
      let totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
      return res.render('cart', {
        cart,
        totalPrice
      })
    })
  },

  addItemQuantity: (req, res) => {
    CartItem.findByPk(req.params.id).then(cartItem => {
      cartItem.update({
        quantity: cartItem.quantity + 1
      }).then((cartItem) => {
        res.redirect('/cart')
      })
    })

  },
  subItemQuantity: (req, res) => {
    CartItem.findByPk(req.params.id).then(cartItem => {
      cartItem.update({
        quantity: cartItem.quantity - 1 >= 1 ? cartItem.quantity - 1 : 1
      }).then((cartItem) => {
        res.redirect('/cart')
      })
    })
  },
  deleteCartItem: (req, res) => {
    CartItem.findByPk(req.params.id).then(cartItem => {
      cartItem.destroy()
        .then((cartItem) => {
          res.redirect('/cart')
        })
    })
  },

  postCart: (req, res) => {
    // console.log('heree ------ session')
    // console.log(req.session)

    //cookie 失效的時候 req.session.cartId 就是 undefine
    //這時就會再建一個新的購物車 cart
    return Cart.findOrCreate({
      where: {
        id: req.session.cartId || 0,
      },
    }).spread(function (cart, created) {
      //尋找該購物車中的項目      
      return CartItem.findOrCreate({
        where: {
          CartId: cart.id,
          ProductId: req.body.productId
        },
        default: {
          CartId: cart.id,
          ProductId: req.body.productId,
        }
      }).spread(function (cartItem, created) {
        //將產品放入購物車或對該項目多加一筆
        return cartItem.update({
          quantity: (cartItem.quantity || 0) + 1,
        })
          .then((cartItem) => {
            //把購物車編號存回session
            req.session.cartId = cart.id
            return req.session.save(() => {
              return res.redirect('back')
            })
          })
      })
    });
  },

}

module.exports = cartController
