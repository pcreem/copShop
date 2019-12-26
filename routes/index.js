const userController = require('../controllers/userController.js')
const productController = require('../controllers/productController.js')
const cartController = require('../controllers/cartController.js')
const orderController = require('../controllers/orderController.js')


const adminController = require('../controllers/adminController.js')

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
      if (req.user.role == 'root') { return next() }
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
  app.get('/orders', authenticated, orderController.getOrders)
  app.post('/order', authenticated, orderController.postOrder)
  app.post('/order/:id/cancel', authenticated, orderController.cancelOrder)



  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)

  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  app.get('/logout', userController.logout)

  //back
  app.get('/admin/index', adminController.getIndex)

  app.get('/admin/users', adminController.getUsers)
  app.get('/admin/users/:id/detail', adminController.getUserdetail)
  app.get('/admin/create/users', adminController.createUser)
  app.post('/admin/users', adminController.postUser)
  app.get('/admin/users/:id/edit', adminController.editUser)
  app.put('/admin/users/:id', adminController.putUser)
  app.delete('/admin/users/:id', adminController.deleteUser)

  app.get('/admin/farmers', adminController.getFarmers)
  app.get('/admin/farmers/:id/detail', adminController.getFarmerdetail)
  app.get('/admin/create/farmers', adminController.createFarmer)
  app.post('/admin/farmers', adminController.postFarmer)
  app.get('/admin/farmers/:id/edit', adminController.editFarmer)
  app.put('/admin/farmers/:id', adminController.putFarmer)
  app.delete('/admin/farmers/:id', adminController.deleteFarmer)

  app.get('/admin/orders', adminController.getOrders)
  app.get('/admin/orders/:id/detail', adminController.getOrderdetail)
  app.get('/admin/orders/:id/edit', adminController.editOrder)
  app.put('/admin/orders/:id', adminController.putOrder)
  app.delete('/admin/orders/:id', adminController.deleteOrder)

  app.get('/admin/products', adminController.getProducts)
  app.get('/admin/products/:id/detail', adminController.getProductdetail)
  app.get('/admin/create/products', adminController.createProduct)
  app.post('/admin/products', upload.single('image'), adminController.postProduct)
  app.get('/admin/products/:id/edit', adminController.editProduct)
  app.put('/admin/products/:id', upload.single('image'),adminController.putProduct)
  app.delete('/admin/products/:id', adminController.deleteProduct)

}
