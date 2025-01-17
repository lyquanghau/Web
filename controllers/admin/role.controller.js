const Role = require('../../models/role.model')
const systemConfig = require("../../config/system");

// [GET] /admin/roles
module.exports.index = async (req, res) => {
    let find = {
        delete: false
    };

    const records = await Role.find(find)

    res.render("admin/pages/roles/index.pug", {
        pageTitle: "Nhóm quyền",
        records: records
    });
}

// [GET] admin/roles/create 
module.exports.create = async (req, res) => {
    res.render("admin/pages/roles/create.pug", {
        pageTitle: "Tạo nhóm quyền"
    });
}


// [POST] admin/roles/create 
module.exports.createPost = async (req, res) => {
    console.log(req.body);

    const record = await Role(req.body);
    await record.save();

    res.redirect(`${systemConfig.prefixAdmin}/roles`);
}

// [GET] admin/roles/edit 
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;

        let find = {
            _id: id,
            delete: false
        };
        const data = await Role.findOne(find);

        res.render("admin/pages/roles/edit.pug", {
            pageTitle: "Chỉnh sửa nhóm quyền",
            data: data
        });
    } catch (error) {
        console.error("Error fetching role data:", error);
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
};

// [PATCH] admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id;

        // let find = {
        //     _id: id,
        //     delete: false
        // };

        // let update = {
        //     $set: req.body
        // };

        await Role.updateOne({
            _id: id
        }, req.body);

        req.flash("success", "Cập nhật thành công");
    } catch (error) {
        req.flash("error", "Cập nhật thất bại");
    }
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
}