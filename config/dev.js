// 引入所需模块
import gulp from 'gulp';
import gulpPlugins from 'gulp-load-plugins';
import del from 'del'; // 清空文件
// 配置文件
import env from './gulp.env';
import {Dir, Path} from './gulp.config';
// 服务器
let browserSync = require('browser-sync').create();
// let reload = browserSync.reload;
// gulp插件不需要写gulp-前缀
let plugins = gulpPlugins();