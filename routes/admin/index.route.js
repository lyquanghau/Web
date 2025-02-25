const dashboardRoutes = require("./dashboard.route");
const productdRoutes = require("./product.route");
const productdCategoryRoutes = require("./product-category.route");
const roleRoutes = require("./role.route");

const systemConfig = require("../../config/system.js");

module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;

    app.use(PATH_ADMIN + "/dashboard", dashboardRoutes);
    app.use(PATH_ADMIN + "/products", productdRoutes);
    app.use(PATH_ADMIN + "/products-category", productdCategoryRoutes);
    app.use(PATH_ADMIN + "/roles", roleRoutes);
    // app.use(PATH_ADMIN + "/products-category/create-categoty", productdCategoryRoutes);
}