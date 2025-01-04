const multer = require('multer');

module.exports = () => {
    const storage = multer.diskStorage({
        destination: function (req, file, cd) {
            cd(null, './public/uploads/'); // Đường dẫn lưu file
        },
        filename: function (req, file, cd) {
            const uniqueSuffix = Date.now(); // Tạo tên file duy nhất
            cd(null, `${uniqueSuffix}-${file.originalname}`); // Tên file được lưu
        }
    });

    return storage;
};