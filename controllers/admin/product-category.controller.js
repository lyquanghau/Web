const ProductCategory = require('../../models/product-category.model');
const filterStatusHelper = require("../../helpers/filterStatus");
const systemConfig = require("../../config/system");
const searchHelper = require("../../helpers/search");

// [GET] /admin/products-category
module.exports.index = async (req, res) => {
    // Bộ lọc
    const filterStatus = filterStatusHelper(req.query);
    let find = {
        delete: false
    }
    if (req.query.status) {
        find.status = req.query.status;
    }

    // Tìm kiếm 
    const objectSearch = searchHelper(req.query);
    if (objectSearch.regex) {
        find.title = objectSearch.regex;
    };

    const records = await ProductCategory.find(find)


    res.render("admin/pages/products-category/index.pug", {
        pageTitle: "Danh mục sản phẩm",
        records: records,
        filterStatus: filterStatus
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