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

  app.get('/users/:id', authenticated, userController.getUser)
  app.get('/users/:id/edit', authenticated, userController.editUser)
  app.put('/users/:id', authenticated, upload.single('image'), userController.putUsers)

  // product
  app.get('/', productController.getProducts)
  app.get('/products/:id', productController.getProduct)
  app.post('/products/search', productController.searchProducts)

  // cart
  app.get('/cart', authenticated, cartController.getCart)// show items in cart
  app.post('/cart', authenticated, cartController.postCart)// add item to cart
  app.post('/cartItem/:id/add', authenticated, cartController.addItemQuantity)// add quantity to item
  app.post('/cartItem/:id/sub', authenticated, cartController.subItemQuantity)// sub quantity to item
  app.delete('/cartItem/:id', authenticated, cartController.deleteCartItem)

  // order
  app.get('/orders', authenticated, orderController.getOrders)
  app.post('/order', authenticated, orderController.postOrder)
  app.post('/order/:id/cancel', authenticated, orderController.cancelOrder)

  // payment
  app.get('/order/:id/payment', authenticated, orderController.getPayment)
  app.post('/newebpay/callback', orderController.newebpayCallback)

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
  app.put('/admin/products/:id', upload.single('image'), adminController.putProduct)
  app.delete('/admin/products/:id', adminController.deleteProduct)

  app.get('/admin/categories', adminController.getCategories)
  app.post('/admin/categories', adminController.postCategory)
  app.get('/admin/categories/:id/edit', adminController.getCategories)
  app.put('/admin/categories/:id', adminController.putCategory)
  app.delete('/admin/categories/:id', adminController.deleteCategory)

  app.get('/admin/populations', adminController.getPopulations)
  app.post('/admin/populations', adminController.postPopulation)
  app.get('/admin/populations/:id/edit', adminController.getPopulations)
  app.put('/admin/populations/:id', adminController.putPopulation)
  app.delete('/admin/populations/:id', adminController.deletePopulation)


  const db = require('../models')
  const Line = db.Line
  const linebot = require('linebot');
  const bot = linebot({
    channelId: process.env.ChannelId,
    channelSecret: process.env.ChannelSecret,
    channelAccessToken: process.env.ChannelAccessToken
  });
  const linebotParser = bot.parser();

  var imgur = require('imgur');
  const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

  imgur.setClientId(IMGUR_CLIENT_ID);
  imgur.getClientId();

  bot.on('message', function (event) {
    console.log(event.message.type)
    if (event.message.type == 'text'){
      event.source.profile().then(function (profile) {
        Line.create({
        usersn: profile.userId,
        name: profile.displayName,
        description: event.message.text
        })
        event.reply(`${profile.displayName} thanks, I got your message`)
      });
      
    }else if (event.message.type == 'image'){
      event.source.profile().then(function (profile) {
        event.message.content().then(function (content) {
        imgur.uploadBase64(content.toString('base64'))
          .then(function (json) {
            Line.create({
              usersn: profile.userId,
              name: profile.displayName,
              image: json.data.link
              })
            event.reply(`${profile.displayName} thanks, I got your image`)
          })
          .catch(function (err) {
            console.error(err.message);
          });
        });        
      });
    }else{
      event.reply('please upload image or text')
    }
  });

  app.post('/linebotParser', linebotParser);

}
