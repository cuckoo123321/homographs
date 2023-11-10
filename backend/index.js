const express = require('express');
const db = require('./db');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const app = express();
const port = 5001;
const adminController = require('./controllers/adminController');


//設置視圖引擎
app.set('view engine', 'ejs');

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//配置中間件
app.use(flash());

app.use((req, res, next) => {
  res.locals.admin_name = req.session.admin_name;
  res.locals.errorMessage = req.flash('errorMessage');
  next();
});

function redirectBack(req, res){  
  res.redirect('back');
}

//設置路由處理
app.get('/',(req, res) => {
  const admin_full_name = req.session.admin_full_name; // 從 session 中獲取變數
  res.render('index',{ admin_full_name });// 傳遞變數到模板
});


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
app.get('/list', adminController.filter);



//啟動伺服器
app.listen(port, () => {
  db.connect();
  console.log(`app_project listening on port ${port}`);
});