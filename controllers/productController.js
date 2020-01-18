const db = require('../models')
const Sequelize = require('sequelize');
const Product = db.Product
const Population = db.Population
const Cart = db.Cart
const Category = db.Category
const pageLimit = 9
const Op = Sequelize.Op // for Search

const productController = {
  getProducts: (req, res) => {
    let offset = 0
    let whereQuery = {}
    let categoryId = ''
    let populationId = ''
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }

    if (req.query.search) {
      var search = req.query.search
      whereQuery = {
        name: {
          [Op.like]: '%' + search + '%'
        }
      }
    }

    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery['CategoryId'] = categoryId
    }

    if (req.query.populationId) {
      populationId = Number(req.query.populationId)
      whereQuery['PopulationId'] = populationId
    }

    Product.findAndCountAll({
      order: [['id', 'ASC']], include: [{ model: Category },
      { model: Population },], where: whereQuery, offset: offset, limit: pageLimit
    }).then(result => {
      // data for pagination
      let page = Number(req.query.page) || 1
      let pages = Math.ceil(result.count / pageLimit)
      let totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      let prev = page - 1 < 1 ? 1 : page - 1
      let next = page + 1 > pages ? pages : page + 1
      // clean up restaurant data

      const data = result.rows.map(r => ({

        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50)
      }))

      Category.findAll().then(categories => {

        Population.findAll().then(populations => {

          // 在右側顯示 Cart
          Cart.findByPk(req.session.cartId, { include: 'items' }).then(cart => {
            cart = cart || { items: [] }
            let totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0

            let cartItemsLength = cart.items.length > 0 ? cart.items.length : ""
            let bgWarning = cart.items.length > 0 ? "bg-warning" : ""

            return res.render('index', {
              cart,
              cartItemsLength,
              bgWarning,
              totalPrice,
              products: data,
              categories: categories,
              categoryId: categoryId,
              populations: populations,
              populationId: populationId,
              page: page,
              totalPage: totalPage,
              prev: prev,
              next: next
            })

          })
        })
      })
    })
  },

  getProduct: (req, res) => {
    return Product.findByPk(req.params.id, {
      include: [Category, Population]
    }).then(product => {
      return res.render('product', {
        product: product
      })
    })
  }
}
module.exports = productController




