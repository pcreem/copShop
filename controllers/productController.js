const db = require('../models')
const Product = db.Product
const Category = db.Category


const productController = {
  getProducts: (req, res) => {
    // res.render('index', { title: 'Express' })

    // Product.findAll({ include: Category }).then(products => {

    let whereQuery = {}
    let categoryId = ''
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery['CategoryId'] = categoryId
    }

    Product.findAll({ include: Category, where: whereQuery }).then(products => {


      const data = products.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50)
      }))
      Category.findAll().then(categories => { // 取出 categoies 
        return res.render('index', {
          products: data,
          categories: categories,
          categoryId: categoryId
        })

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




