const Product = require('../../models/product.model');
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require("../../config/system");

// [GET] /admin/products - Hiển thị danh sách sản phẩm
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

    // Phân trang
    const countProducts = await Product.countDocuments(find);
    let objectPagination = paginationHelper({
            currentPage: 1,
            limitItem: 10
        },
        req.query,
        countProducts
    )

    const products = await Product.find(find)
        .sort({
            position: "desc"
        })
        .limit(objectPagination.limitItem)
        .skip(objectPagination.skip);

    // Làm tròn giá trị giá sản phẩm
    products.forEach(product => {
        product.price = Math.floor(product.price); // Hoặc Math.round(product.price)
    });

    res.render("admin/pages/products/index.pug", {
        pageTitle: "Danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
};


// [PATCH] admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {

    const status = req.params.status;
    const id = req.params.id;

    await Product.updateOne({
        _id: id
    }, {
        status: status
    });

    req.flash('success', "Cập nhật trạng thái sản phẩm thành công")

    res.redirect('back');
}

// [PATCH] admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    // console.log(req.body);
    const type = req.body.type;
    const ids = req.body.ids.split(', ');

    switch (type) {
        case "active":
            await Product.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                status: 'active'
            })
            req.flash('success', `Cập nhật trạng thái thành công cho ${ids.length} sản phẩm`)
            break;
        case "inactive":
            await Product.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                status: 'inactive'
            })
            req.flash('success', `Cập nhật trạng thái thành công cho ${ids.length} sản phẩm`)
            break;
        case "delete-all":
            await Product.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                delete: true,
                deletedAt: new Date
            })
            req.flash('success', `Xóa ${ids.length} sản phẩm thành công`)
            break;
        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split("-")
                position = parseInt(position);

                await Product.updateOne({
                    _id: id
                }, {
                    position: position
                });
            }
            req.flash('success', `${ids.length} sản phẩm đã được thay đổi vị trí`)
        default:
            break;
    }
    res.redirect("back");
}

// [DELETE] admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;

    await Product.updateOne({ // deleteOne
        _id: id
    }, {
        delete: true,
        deletedAt: new Date
    });
    req.flash('success', "Xóa sản phẩm thành công")
    res.redirect('back');
}

// [GET] admin/products/create 
module.exports.create = async (req, res) => {
    res.render("admin/pages/products/create.pug", {
        pageTitle: "Thêm mới sản phẩm"
    });
}

// [PATCH] admin/products/create
module.exports.createPost = async (req, res) => {
    try {
        req.body.price = parseInt(req.body.price);
        req.body.discountPercentage = parseInt(req.body.discountPercentage);
        req.body.stock = parseInt(req.body.stock);

        if (!req.body.position) {
            const countProducts = await Product.countDocuments();
            req.body.position = countProducts + 1;
        } else {
            req.body.position = parseInt(req.body.position);
        }

        const product = new Product(req.body);
        await product.save();

        res.redirect(`${systemConfig.prefixAdmin}/products`);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'Internal server error.'
        });
    }
};

// [GET] admin/products/edit/:id 
module.exports.edit = async (req, res) => {
    try {
        const find = {
            delete: false,
            _id: req.params.id
        }

        const product = await Product.findOne(find);

        res.render("admin/pages/products/edit.pug", {
            pageTitle: "Chỉnh sửa sản phẩm",
            product: product
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
}

// [PATCH] admin/products/edit/:id 
module.exports.editPatch = async (req, res) => {
    const id = req.params.id
    req.body.price = parseFloat(req.body.price);
    req.body.discountPercentage = parseFloat(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);

    // if (req.file) {
    //     req.body.thumbnail = `/uploads/${req.file.filename}`;
    // }

    try {
        await Product.updateOne({
            _id: id
        }, req.body)
        req.flash('success', "Cập nhật thành công")
    } catch (error) {
        req.flash('error', "Cập nhật thất bại")
    }

    res.redirect(`${systemConfig.prefixAdmin}/products`);
};

// [GET] admin/products/edit/:id 
module.exports.detail = async (req, res) => {
    try {
        const find = {
            delete: false,
            _id: req.params.id
        }

        const product = await Product.findOne(find);

        res.render("admin/pages/products/detail.pug", {
            pageTitle: product.title,
            product: product
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
}