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
        await Role.updateOne({
            _id: id
        }, req.body);

        req.flash("success", "Cập nhật thành công");
    } catch (error) {
        req.flash("error", "Cập nhật thất bại");
    }
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
}

// [GET] admin/roles/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;

        let find = {
            _id: id,
            delete: false
        };
        const data = await Role.findOne(find);

        res.render("admin/pages/roles/detail.pug", {
            pageTitle: "Chi tiết nhóm quyền",
            data: data
        });
    } catch (error) {
        console.error("Error fetching role data:", error);
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
};

// [GET] admin/roles/permissions
module.exports.permissions = async (req, res) => {
    try {
        let find = {
            delete: false
        };
        const records = await Role.find(find);

        res.render("admin/pages/roles/permissions.pug", {
            pageTitle: "Phân quyền",
            records: records
        });

    } catch (error) {
        console.error("Error fetching role data:", error);
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
};

// [PATCH] admin/roles/permissions
module.exports.permissionsPatch = async (req, res) => {
    try {
        const permissions = JSON.parse(req.body.permissions);

        // Cập nhật permissions trong một vòng lặp
        for (const item of permissions) {
            await Role.updateOne({
                _id: item.id
            }, {
                permissions: item.permissions
            });
        }

        // Gửi phản hồi sau khi hoàn tất tất cả các cập nhật
        req.flash("success", "Cập nhật phân quyền thành công!");
        res.redirect(req.get("Referrer") || "/"); // Thay "back" bằng giải pháp an toàn hơn
    } catch (error) {
        console.error(error); // Log lỗi để dễ debug
        req.flash("error", "Cập nhật phân quyền thất bại!");
        res.redirect(req.get("Referrer") || "/"); // Thay "back" bằng giải pháp an toàn hơn
    }
};

// [GET] admin/roles/delete/:id

module.exports.delete = async (req, res) => {
    try {
        const id = req.params.id;

        await Role.updateOne({
            _id: id
        }, {
            delete: true
        });

        req.flash("success", "Xóa nhóm quyền thành công!");
        res.redirect(req.get("Referrer") || "/"); // Thay "back" b��ng giải pháp an toàn hơn
    } catch (error) {
        console.error(error); // Log l��i để d�� debug
        req.flash("error", "Xóa nhóm quyền thất bại!");
        res.redirect(req.get("Referrer") || "/"); // Thay "back" b��ng giải pháp an toàn hơn
    }
};