const db = require('../models')

const Product = db.Product
const Category = db.Category
const User = db.User
const Farmer = db.Farmer
const Payment = db.Payment
const Order = db.Order
const Population = db.Population
const pageLimit = 10
const sequelize = require('sequelize');
const Op = sequelize.Op

const adminController = {
  getIndex: (req, res) => {
    Order.findAll({ include: 'items', }).then(orders => {
      orders = orders.map(order => ({
        ...order.dataValues,
      }))

      //資料解構測試
      orders.forEach(element => (element))
      orders.forEach(element => (element.items).forEach(eter => (eter.dataValues.OrderItem.quantity)));
      //根據padi條件重構product資料
      let productA = []
      let paidarr = []
      for (let i = 0; i < orders.length; i++) {
        if (orders[i].payment_status == 'paid') {
          paidarr.push('1')
          for (let a = 0; a < orders[i].items.length; a++) {
            let product = {};
            product.sn = (orders[i].sn)
            product.pid = (orders[i].items[a].dataValues.id)
            product.pname = (orders[i].items[a].dataValues.name)
            product.pprice = (orders[i].items[a].dataValues.price)
            product.pquantity = (orders[i].items[a].dataValues.OrderItem.quantity)
            product.pamount = (orders[i].items[a].dataValues.price) * (orders[i].items[a].dataValues.OrderItem.quantity)
            productA.push(product)
          }
        }
      }

      for (var i = 0; i < productA.length; i++) {
        for (var a = 1; a < productA.length; a++) {
          if (productA[i].pid === productA[a].pid && productA[i].sn !== productA[a].sn) {
            productA[i].pprice += productA[a].pprice
            productA[i].pquantity += productA[a].pquantity
            productA[i].pamount += productA[a].pamount
            productA.splice(a, 1)
          }
        }
      }
      Order.findAll({
        attributes: [
          'UserId',
          [sequelize.fn('sum', sequelize.col('amount')), 'total_amount'],
          [sequelize.fn('sum', sequelize.col('cost')), 'total_cost'],
        ],
        where: {
          payment_status: 'paid'
        },
        group: ['UserId'],


      }).then(userAmounts => {
        userAmounts = userAmounts.map(userAmount => ({
          ...userAmount.dataValues,
        }))

        let orderamount = 0
        let ordercost = 0
        for (let i = 0; i < userAmounts.length; i++) {
          orderamount += Number(userAmounts[i].total_amount)
          ordercost += Number(userAmounts[i].total_cost)
        }

        var backendData = {
          total_orders: orders.length, //總訂單數量
          conclude_orders: paidarr.length, //成交訂單量
          total_amount: orderamount, //成交金額
          total_cost: ordercost, //成本
          gross: orderamount - ordercost, //毛利
          profit_margin: Math.round((orderamount - ordercost) / orderamount * 100), //毛利率
          per_customer_transaction: orderamount / userAmounts.length //客單價
        }


        return res.render('admin/index', {
          orders, userAmounts, productA, backendData
        })
      })
    })
  },

  getUsers: (req, res) => {
    return User.findAll({
      where: {
        role: 'user'
      }
    }).then((users) => {
      users = users.map(user => ({
        ...user.dataValues,
      }))
      return res.render('admin/users', { users: users })
    })
  },
  getUserdetail: (req, res) => {
    return User.findByPk(req.params.id, {
      include: { model: Order, include: { model: Product, as: 'items' } },
    }).then((user) => {
      user = user.dataValues
      return res.render('admin/userdetail', { user: user })
    })
  },
  createUser: (req, res) => {
    return res.render('admin/createUser')
  },
  postUser: (req, res) => {
    return User.create({
      name: req.body.name,
      email: req.body.email,
      address: req.body.address,
      tel: req.body.tel, 
      role:'user'    
    })
      .then((user) => {
        res.redirect('/admin/users')
      })
  },
  editUser: (req, res) => {
    return User.findByPk(req.params.id).then(user => {
      return res.render('admin/createUser', { user: user })
    })
  },
  putUser: (req, res) => {
    return User.findByPk(req.params.id)
      .then((user) => {
        user.update({
          name: req.body.name,
          email: req.body.email,
          address: req.body.address,
          tel: req.body.tel,
          role: req.body.role
        })
          .then((user) => {
            res.redirect('/admin/users')
          })
      })
  },
  deleteUser: (req, res) => {
    return User.findByPk(req.params.id)
      .then((user) => {
        user.destroy()
          .then((user) => {
            res.redirect('/admin/users')
          })
      })
  },

  getFarmers: (req, res) => {
    return Farmer.findAll({
    }).then((farmers) => {
      farmers = farmers.map(farmer => ({
        ...farmer.dataValues,
      }))
      return res.render('admin/farmers', { farmers: farmers })
    })
  },
  getFarmerdetail: (req, res) => {
    return Farmer.findByPk(req.params.id, {
      include: { model: Product, where:{FarmerId:req.params.id} },
    }).then((farmer) => {
      farmer = farmer.dataValues
      console.log(farmer.Products)
      return res.render('admin/farmerdetail', { farmer: farmer })
    })
  },
  createFarmer: (req, res) => {
    return res.render('admin/createFarmer')
  },
  postFarmer: (req, res) => {
    return Farmer.create({
      name: req.body.name,
      tel: req.body.tel,
      address: req.body.address,
      line: req.body.line
    })
      .then((farmer) => {
        res.redirect('/admin/farmers')
      }).catch(function(err) {
    // print the error details
    console.log(err, req.body.name);
    });
  },
  editFarmer: (req, res) => {
    return Farmer.findByPk(req.params.id).then(farmer => {
      return res.render('admin/createFarmer', { farmer: farmer })
    })
  },
  putFarmer: (req, res) => {
    return Farmer.findByPk(req.params.id)
      .then((farmer) => {
        farmer.update({
          name: req.body.name,
          line: req.body.line,
          address: req.body.address,
          tel: req.body.tel
        })
          .then((farmer) => {
            res.redirect('/admin/farmers')
          })
      })
  },
  deleteFarmer: (req, res) => {
    return Farmer.findByPk(req.params.id)
      .then((farmer) => {
        farmer.destroy()
          .then((farmer) => {
            res.redirect('/admin/farmers')
          })
      })
  },



  getOrders: (req, res) => {
    return Payment.findAll({
      limit: 5,
      order: [['amount', 'DESC']],
      include: [
        { model: User },
        {
          model: Order,
          include: [{
            model: Product, as: 'items'
          }]
        }]
    }).then((payments) => {
      payments = payments.map(payment => ({
        ...payment.dataValues,
      }))

      console.log(payments)

      return res.render('admin/orders', { payments: payments })
    })

  },
}
module.exports = adminController




