    const express = require('express');
    const router = express.Router();

    const controller = require("../../controllers/client/product.controllers")

    router.get("/", controller.index);

    // router.get("/create", (req, res) => {
    //     res.render("client/pages/products/index.pug");
    // });

    // router.get("/edit", (req, res) => {
    //     res.render("client/pages/products/index.pug");
    // });

    // router.get("/delete", (req, res) => {
    //     res.render("client/pages/products/index.pug");
    // });
    router.get("/:slug", controller.detail);
    module.exports = router;