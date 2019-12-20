const userController = require('../controllers/userController.js')
const productController = require('../controllers/productController.js')
const cartController = require('../controllers/cartController.js')

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

  //front : product
  app.get('/', productController.getProducts)
  app.get('/products/:id', productController.getProduct)
  app.post('/products/search', productController.searchProducts)

  // cart
  app.get('/cart', cartController.getCart)
  app.post('/cart', cartController.postCart)




  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)

  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  app.get('/logout', userController.logout)
}
