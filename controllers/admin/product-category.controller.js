const ProductCategory = require('../../models/product-category.model');
const filterStatusHelper = require("../../helpers/filterStatus");
const systemConfig = require("../../config/system");
const searchHelper = require("../../helpers/search");
const createTreeHelper = require("../../helpers/createTree");

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

    const records = await ProductCategory.find(find);
    const newRecords = createTreeHelper.tree(records);

    res.render("admin/pages/products-category/index.pug", {
        pageTitle: "Danh mục sản phẩm",
        records: newRecords,
        filterStatus: filterStatus
    });
};

// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
    let find = {
        delete: false
    }

    const records = await ProductCategory.find(find);
    const newRecords = createTreeHelper.tree(records);

    res.render("admin/pages/products-category/create.pug", {
        pageTitle: "Thêm mới danh mục sản phẩm",
        records: newRecords
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

// [GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await ProductCategory.findOne({
            _id: id,
            delete: false
        })
        const records = await ProductCategory.find({
            delete: false
        });
        const newRecords = createTreeHelper.tree(records);

        res.render("admin/pages/products-category/edit.pug", {
            pageTitle: "Chỉnh sửa danh mục sản phẩm",
            data: data,
            records: newRecords
        });
    } catch (err) {
        res.redirect(`${systemConfig.prefixAdmin}/products-category`)
    }
};

// [PATCH] /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
    try {

        const id = req.params.id;

        req.body.position = parseInt(req.body.position);

        await ProductCategory.updateOne({
            _id: id
        }, req.body)

        res.redirect("back");

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'Internal server error.'
        });
    }
};


// [GET] admin/products-category/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await ProductCategory.findOne({
            _id: id,
            delete: false
        })
        res.render("admin/pages/products-category/detail.pug", {
            pageTitle: data.title,
            data: data
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products-category`)
    }
}