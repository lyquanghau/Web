    // Import các module cần thiết
    const express = require('express');
    const methodOverride = require('method-override');
    const bodyParser = require('body-parser');
    const cookieParser = require('cookie-parser');
    const session = require('express-session');
    const flash = require('express-flash');


    // Import cấu hình và các file module
    const systemConfig = require('./config/system.js');
    const database = require('./config/database');
    const route = require('./routes/client/index.route');
    const routeAdmin = require('./routes/admin/index.route');

    // Load biến môi trường từ file .env
    require('dotenv').config();

    // Khởi tạo ứng dụng Express
    const app = express();

    // Cấu hình cổng từ biến môi trường
    const port = process.env.PORT;

    // Thiết lập prefix cho admin (từ systemConfig)
    app.locals.prefixAdmin = systemConfig.prefixAdmin;

    // Cấu hình thư mục views và view engine
    app.set('views', `${__dirname}/views`);
    app.set('view engine', 'pug');

    // Thiết lập thư mục tĩnh cho các file public
    app.use(express.static(`${__dirname}/public`));

    // Hỗ trợ method-override (ví dụ: PUT, DELETE qua query string)
    app.use(methodOverride('_method'));

    // Cấu hình body-parser để phân tích dữ liệu từ form
    app.use(bodyParser.urlencoded({
        extended: false
    }));

    // Cấu hình cookie-parser với secret key
    app.use(cookieParser('DJFHSDJKGDJKFHDJK'));

    // Cấu hình session với thời gian tồn tại cookie
    app.use(session({
        cookie: {
            maxAge: 60000
        } // Cookie tồn tại 60 giây
    }));

    // Sử dụng flash để hiển thị thông báo tạm thời
    app.use(flash());

    // Kết nối cơ sở dữ liệu
    database.connect();

    // Gọi các route
    routeAdmin(app); // Định nghĩa route cho admin
    route(app); // Định nghĩa route cho client

    // Khởi động server
    app.listen(port, () => {
        console.log(`App listening on port ${port}`);
    });