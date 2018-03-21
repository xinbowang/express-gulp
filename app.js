var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// 引入swig模块 ： 配置html模板
var swig = require('swig');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

/*
 * 配置模板引擎
 * 1.定义当前所使用的模板引擎
 * 第一个参数 ：模板引擎名称，同时也是文件名后缀名；
 * 第二个参数 ： 用于解析模板内容的方法
 */
app.engine('html',swig.renderFile);
// view engine setup
app.set('views', path.join(__dirname, 'dist/views'));
app.set('view engine', 'html');
// 在开发过程中，取消模板默认缓存
swig.setDefaults({cache:false});
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

/*
 * 访问静态资源文件时，express.static 中间件会根据目录添加的顺序查找所需的文件。
 * 第一个 参数 指定访问静态文件名称【支持正则方式】  第二个参数文件所在目录
 */
app.use('/dist', express.static(path.join(__dirname,'/dist')));

/*
 * 各模块Routes路由入口文件:
 * 		默认写法 app.use('/', routes); 第一个参数 路由路径， 第二个参数 绑定的路由规则
 * 		这里的router放到了外部文件，以模块的方式引入。
 * 		require('./routes/index') => 文件内的 module.exports = router;
 */
app.use('/', routes);
app.use('/users', users);
console.log(app.get('env'), process.env.NODE_ENV);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message + ' dev',
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message  + ' pro',
    error: {}
  });
});


module.exports = app;
