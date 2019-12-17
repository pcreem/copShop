const db = require('../models')
const Product = db.Product
const Category = db.Category


const productController = {
  getProducts: (req, res) => {
    // res.render('index', { title: 'Express' })

    Product.findAll({ include: Category }).then(products => {
      const data = products.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50)
      }))
      return res.render('index', {
        products: data,
        title: 'Express'
      })
    })

  },
  getProduct: (req, res) => {
    return Product.findByPk(req.params.id, {
      include: Category
    }).then(product => {
      return res.render('product', {
        product: product
      })
    })
  }
}
module.exports = productController




