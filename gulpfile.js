'use strict';
var gulp = require('gulp');
var minify = require('gulp-clean-css');

var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var sequence = require('gulp-sequence'); // 启动多个gulp
var nodemon = require('gulp-nodemon'); // node服务重启

var cache = require('gulp-cache'); // 缓存

var uglify = require('gulp-uglify'); // 压缩js
var webpack = require('gulp-webpack'); // 编译require
var babel = require('gulp-babel');
var htmlmin = require('gulp-htmlmin');
var htmlreplace = require('gulp-html-replace'); // 替换文件
var imagemin = require('gulp-imagemin'); // 图片压缩
var pngquant = require('imagemin-pngquant'); // 使用pngquant深度压缩png图片的imagemin插件
var sass = require('gulp-sass');
var postcss = require('gulp-postcss'); // css3兼容
var rename = require('gulp-rename'); // 重命名文件
var concat = require('gulp-concat'); // 合并文件
var autoprefixer = require('autoprefixer');
var sourcemaps = require('gulp-sourcemaps'); // 指向编译前位置
var path = require('path');

var concat = require('gulp-concat'); // 合并文件

var jshint = require('gulp-jshint');
var gulpIf = require('gulp-if');

var cssBase64 = require('gulp-base64');
var plumber = require('gulp-plumber'); // 容错不挂机
var del = require('del');

// dev：开发环境 undefined:生产环境
var env = process.env.NODE_ENV;
// 删除文件
if (env === 'dev') {
  console.log('-----开发环境-----');
} else {
  console.log('+++++生产环境+++++');
}
gulp.task('clean', function() {
  return del(['./dist/']);
});

// 压缩ejs
gulp.task('swig', function() {
  var options = {
    removeComments: true,//清除HTML注释
    collapseWhitespace: true,//清除空格，压缩HTML
    collapseBooleanAttributes: false,//省略布尔属性的值 <input checked="true"/> ==> <input />
    removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
    removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
    removeStyleLinkTypeAttributes: true,//删除<style>和<mixin>的type="text/css"
    minifyJS: true,//压缩页面JS
    minifyCSS: true//压缩页面CSS
  };
  return gulp.src('views/**/*.html').pipe(plumber({
    errorHandler: true,
  })).pipe(gulpIf(!env, htmlreplace({ // 替换压缩之后的js、css
    'css': {
      src: '/dist/css',
      tpl: '<link rel="stylesheet" href="%s/app.min.css">',
    },
    // 'css': ['css/build.min.css'],
    'js': ['/dist/js/app.min.js'],
  }))).pipe(gulpIf(!env, htmlmin(options)))
  // .pipe(swig({ defaults: { cache: false } }))
      .pipe(gulp.dest('./dist/views/')).pipe(reload({
        stream: true,
      }));
});

// 压缩sass
gulp.task('sass', function() {
  var plug = [
    autoprefixer({browsers: ['> 1%', 'last 2 version'], cascade: false}),
  ];
  return gulp.src('public/sass/**/*.scss').
      pipe(plumber({
        errorHandler: true,
      })).
      pipe(cssBase64({
        baseDir: 'public/sass/**/*.scss',
        extensions: ['svg', 'png', /\.jpg#datauri$/i],
        maxImageSize: 100 * 1024, // 小于100kb转码
        debug: true,
      })).
      pipe(sourcemaps.init({loadMaps: true})).
      pipe(concat('app.scss')) // 合并sass
      .pipe(sass()).
      pipe(postcss(plug)) // 放到编译后面，否则可能报错
      .pipe(sourcemaps.write('./map/')).
      pipe(gulpIf(!env, minify())).
      pipe(gulpIf(!env, rename({
        suffix: '.min',
      }))).
      pipe(gulp.dest('dist/css/')).
      pipe(reload({
        stream: true,
      }));
});

// 压缩js
gulp.task('js', function() {
  return gulp.src('public/js/**/*.js').
      pipe(plumber({
        errorHandler: true,
      })).
      pipe(sourcemaps.init({loadMaps: true}))
      // .pipe(jshint())
      // .pipe(jshint.reporter('default'))
      .pipe(babel()).
      pipe(gulp.dest('dist/js')).
      pipe(webpack({ // 合并js，并将import改成requite方式
        output: {
          filename: 'app.js',
        },
      })).
      pipe(gulpIf(!env, rename({
        suffix: '.min',
      }))).
      pipe(gulpIf(!env, uglify())) // 压缩js
      .pipe(sourcemaps.write('./map/')).
      pipe(gulp.dest('dist/js/')).
      pipe(reload({
        stream: true,
      }));
});

// 压缩routes
gulp.task('routes', function() {
  return gulp.src('routes/**/*.js').pipe(reload({
    stream: true,
  }));
});

// 压缩img
gulp.task('img', function() {
  return gulp.src('public/img/**/*')        //引入所有需处理的Img
      .pipe(plumber({
        errorHandler: true,
      }))
      // .pipe( imagemin({optimizationLevel: 3, progressive: true, interlaced: true}))      //压缩图片
      // 如果想对变动过的文件进行压缩，则使用下面一句代码
      .pipe(cache(imagemin({
            optimizationLevel: 3, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true, //类型：Boolean 默认：false 多次优化svg直到完全优化
            svgoPlugins: [{removeViewBox: false}], //不要移除svg的viewbox属性
            use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
          }))).
      pipe(gulp.dest('dist/img/')).
      pipe(reload({
        stream: true,
      }));

});

// 浏览器同步，用7000端口去代理Express的3000端口
gulp.task('browser-sync', ['nodemon'], function() {
  browserSync.init(null, {
    proxy: 'http://localhost:3000',
    files: ['dist/views/*.*', 'dist/css/*.*', 'dist/js/*.*', 'dist/img/*.*'],
    // server: {
    //   baseDir: './dist'
    // },
    // browser: "google chrome",
    port: 7000,
  });
});

// 开启Express服务
gulp.task('nodemon', function(cb) {

  var started = false;
  return nodemon({
    script: 'bin/www',
  }).on('start', function() {
    // to avoid nodemon being started multiple times
    // thanks @matthisk
    if (!started) {
      cb();
      started = true;
    }
  });
});

gulp.task('build', ['clean'], function() {
  sequence(['sass', 'swig', 'js', 'img', 'routes'], function() {
  });
});

gulp.task('default', ['clean'], function() {
  sequence(['sass', 'swig', 'js', 'img', 'routes'], 'browser-sync', function() {
    // 将你的默认的任务代码放这
    // 监听所有css文档
    gulp.watch('public/**/*.scss', ['sass']);

    // 监听所有.js档
    gulp.watch('public/**/*.js', ['js']);
    // 监听所有.js档
    gulp.watch('routes/**/*.js', ['routes']);
    // 监听所有图片档
    gulp.watch('public/img/**/*', ['img']);
    // 监听ejs
    gulp.watch('views/**/*.html', ['swig']);
  });
});


