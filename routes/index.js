const userController = require('../controllers/userController.js')
const productController = require('../controllers/productController.js')
const cartController = require('../controllers/cartController.js')
const orderController = require('../controllers/orderController.js')


const multer = require('multer')
const upload = multer({ dest: 'temp/' })



module.exports = (app, passport) => {
  const authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/signin')
  }

  const authenticatedAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.isAdmin) { return next() }
      return res.redirect('/')
    }
    res.redirect('/signin')
  }

  // product
  app.get('/', productController.getProducts)
  app.get('/products/:id', productController.getProduct)
  app.post('/products/search', productController.searchProducts)

  // cart
  app.get('/cart', cartController.getCart)// show items in cart
  app.post('/cart', cartController.postCart)// add item to cart
  app.post('/cartItem/:id/add', cartController.addItemQuantity)// add quantity to item
  app.post('/cartItem/:id/sub', cartController.subItemQuantity)// sub quantity to item
  app.delete('/cartItem/:id', cartController.deleteCartItem)

  // order
  app.get('/orders', orderController.getOrders)
  app.post('/order', orderController.postOrder)
  app.post('/order/:id/cancel', orderController.cancelOrder)



  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)

  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  app.get('/logout', userController.logout)
}
