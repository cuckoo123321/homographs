const express = require('express');
const db = require('./db');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const app = express();
const port = 5001;
const adminController = require('./controllers/adminController');
const userController = require('./controllers/userController');
const eventController = require('./controllers/eventController');
const carouselController = require('./controllers/carouselController');
const productController = require('./controllers/productController');
const productReviewController = require('./controllers/productReviewController');
const favoriteController = require('./controllers/favoriteController');
const cartController = require('./controllers/cartController');
const path = require('path');
const apiRoutes = require('./routes/apiRoutes'); //API路由
const cors = require('cors'); //同源政策
require('dotenv').config();


//設置視圖引擎
app.set('view engine', 'ejs');

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//確保 app.use(cors()) 的設定位於 app.use(apiRoutes) 之前
app.use(cors());
app.use(apiRoutes);


//配置中間件
app.use(flash());

app.use((req, res, next) => {
  res.locals.admin_name = req.session.admin_name;
  res.locals.errorMessage = req.flash('errorMessage');
  res.locals.totalPages = 0;
  next();
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


function redirectBack(req, res){  
  res.redirect('back');
}

//設置路由處理
app.get('/',(req, res) => {
  const admin_full_name = req.session.admin_full_name; // 從 session 中獲取變數
  res.render('index',{ admin_full_name });// 傳遞變數到模板
});

//admin
app.get('/login', adminController.login);
app.post('/login', adminController.handleLogin, redirectBack);
app.get('/logout', adminController.logout);
app.get('/add', adminController.add);
app.post('/add', adminController.handleAdd, redirectBack);
app.get('/list', adminController.getAll);
app.get('/delete_admin/:id', adminController.delete);
app.get('/update_admin/:id', adminController.update);
app.post('/update_admin/:id', adminController.handleUpdate);
app.get('/search', adminController.search);

//user
app.get('/userAdd', userController.add);
app.post('/userAdd', userController.handleAdd, redirectBack);
app.get('/userList', userController.getAll);
app.get('/update_user/:id', userController.update);
app.post('/update_user/:id', userController.handleUpdate);
app.get('/delete_user/:id', userController.softDelete);
//user前端用 API
app.post('/userLogin', userController.userLogin);
app.get('/user', userController.getUserInfo);
app.post('/userRegister', userController.userRegister);
app.put('/userUpdate/:id', userController.FrontendHandleUpdate);

//product
app.get('/productAdd', productController.add);
app.post('/productAdd', productController.handleAdd, redirectBack);
app.get('/productList', productController.getAll);
app.get('/update_product/:id', productController.update);
app.post('/update_product/:id', productController.handleUpdate);
app.get('/delete_product/:id', productController.delete);
//product前端用API
app.get('/:id', productController.getProductById);

//productReview
app.get('/productReviewList', productReviewController.getAll);
//app.get('/delete_productReview/:id', productReviewController.delete);

//event
app.get('/eventAdd', eventController.add);
app.post('/eventAdd', eventController.handleAdd, redirectBack);
app.get('/eventList', eventController.getAll);
app.get('/update_event/:id', eventController.update);
app.post('/update_event/:id', eventController.handleUpdate);
app.get('/delete_event/:id', eventController.delete);

//carousel
app.get('/carouselAdd', carouselController.add);
app.post('/carouselAdd', carouselController.handleAdd, redirectBack);
app.get('/carouselList', carouselController.getAll);
app.get('/update_carousel/:id', carouselController.update);
app.post('/update_carousel/:id', carouselController.handleUpdate);
app.get('/delete_carousel/:id', carouselController.delete);

//favorite
app.post('/favoriteAdd', favoriteController.addToFavorites);
app.get('/favoriteList/:user_id?', favoriteController.getFavorite);
app.delete('/favoriteRemove/:favorite_id', favoriteController.removeFromFavorites);

//cart
app.post('/addToCart', cartController.addToCart);
app.get('/cartList/:user_id?', cartController.getCartItems);
app.put('/updateQuantity/:user_id/:product_id', cartController.updateCartQuantity);
app.delete('/deleteCartItem/:user_id/:product_id', cartController.deleteCartItem);


//啟動伺服器
app.listen(port, () => {
  db.connect();
  console.log(`app_project listening on port ${port}`);
});