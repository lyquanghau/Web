module.exports.createPost = (req, res, next) => {
    if (!req.body.title) {
        req.flash('error', "Tiêu đề không được để trống!")
        res.redirect('back');
        return;
    }
    next();
}