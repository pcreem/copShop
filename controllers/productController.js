const db = require('../models')
const Product = db.Product
const Category = db.Category
const pageLimit = 10



const productController = {
  getProducts: (req, res) => {
    // res.render('index', { title: 'Express' })

    // Product.findAll({ include: Category }).then(products => {

    let offset = 0
    let whereQuery = {}
    let categoryId = ''
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }

    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery['CategoryId'] = categoryId
    }

    // Product.findAll({ include: Category, where: whereQuery }).then(products => {


    //   const data = products.map(r => ({


    Product.findAndCountAll({ include: Category, where: whereQuery, offset: offset, limit: pageLimit }).then(result => {
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
      Category.findAll().then(categories => { // 取出 categoies 
        return res.render('index', {
          products: data,
          categories: categories,
          categoryId: categoryId,
          page: page,
          totalPage: totalPage,
          prev: prev,
          next: next
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




