const express = require('express')
const handlebars = require('express-handlebars')
const db = require('./models')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('./config/passport')
var cookieParser = require('cookie-parser');
const app = express()
const port = process.env.PORT || 3000

app.engine('handlebars', handlebars({
  defaultLayout: 'main',
  helpers: require('./config/handlebars-helpers.js')
}))

app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser());
app.use(session({
  secret: 'ac',
  name: 'ac',
  cookie: { maxAge: 80000 },
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(methodOverride('_method'))

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = req.user
  next()
})

app.listen(port, () => {
  db.sequelize.sync()
  console.log(`Example app listening on port ${port}`)
})

require('./routes')(app, passport)
