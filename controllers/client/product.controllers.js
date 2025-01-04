const Product = require("../../models/product.model");

// [GET] /products

module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        delete: false
    }).sort({
        position: "desc"
    });

    const newProduct = products.map(item => {
        item.priceNew = (item.price * (100 - item.discountPercentage) / 100).toFixed(0);
        return item;
    })

    res.render("client/pages/products/index.pug", {
        pageTitle: "Products",
        products: newProduct
    });
}

// [GET] /products/:slug

module.exports.detail = async (req, res) => {
    const product = await Product.findOne({
        slug: req.params.slug,
        status: "active",
        delete: false
    });

    if (!product) {
        return res.status(404).render("client/pages/404.pug", {
            pageTitle: "Page Not Found"
        });
    }
    product.priceNew = (product.price * (100 - product.discountPercentage) / 100).toFixed(0);
    res.render("client/pages/products/detail.pug", {
        pageTitle: product.slug,
        product
    });
}