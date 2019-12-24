const userController = require('../controllers/userController.js')
const productController = require('../controllers/productController.js')

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

  //front : product
  app.get('/', productController.getProducts)
  app.get('/products/:id', productController.getProduct)
  app.post('/products/search', productController.searchProducts)


  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)

  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  app.get('/logout', userController.logout)

  //back
  app.get('/admin/index', adminController.getIndex)
  app.get('/admin/users', adminController.getUsers)
  app.get('/admin/create/users', adminController.createUser)
  app.post('/admin/users', adminController.postUser)
  app.get('/admin/users/:id/detail', adminController.getUserdetail)
  app.get('/admin/users/:id/edit', adminController.editUser)
  app.put('/admin/users/:id', adminController.putUser)
  app.delete('/admin/users/:id', adminController.deleteUser)
  app.get('/admin/orders', adminController.getOrders)
}
