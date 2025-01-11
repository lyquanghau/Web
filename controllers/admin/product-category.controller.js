const ProductCategory = require('../../models/product-category.model');
const systemConfig = require("../../config/system");

// [GET] /admin/products-category
module.exports.index = async (req, res) => {

    let find = {
        delete: false
    }

    const records = await ProductCategory.find(find)


    res.render("admin/pages/products-category/index.pug", {
        pageTitle: "Danh mục sản phẩm",
        records: records
    });
};

// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/products-category/create.pug", {
        pageTitle: "Thêm mới danh mục sản phẩm"
    });
};

// [POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
    try {
        if (!req.body.position) {
            const count = await ProductCategory.countDocuments();
            req.body.position = count + 1;
        } else {
            req.body.position = parseInt(req.body.position);
        }

        const record = new ProductCategory(req.body);
        await record.save();

        res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'Internal server error.'
        });
    }
};