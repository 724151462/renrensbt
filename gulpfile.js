const {src, dest, series,parallel, watch} = require('gulp')
const del = require('del')
const browserSync = require('browser-sync').create()
const reload = browserSync.reload
// gulp-uglify => plugins.uglify = require('gulp-uglify')
const plugins = require('gulp-load-plugins')()

var htmlmin = require('gulp-htmlmin');

function htmlMin(cb){

	var options = {
		collapseWhitespace:true,
		collapseBooleanAttributes:true,
		removeComments:true,
		removeEmptyAttributes:true,
		removeScriptTypeAttributes:true,
		removeStyleLinkTypeAttributes:true,
		minifyJS:true,
		minifyCSS:true
	};
	src(['./src/*.html', './src/_include/*.html'])
	.pipe(htmlmin(options))
	.pipe(dest('./dist'));
	cb()
};

const gutil = require('gulp-util')
const babel = require('gulp-babel')
// 压缩js uglifyjs
function js(cb) {
  src('./src/js/*.js')
    // 下一个处理环节
	.pipe(babel())
    .pipe(plugins.uglify())
		.on('error', function(err) {
		                gutil.log(gutil.colors.red('[Error]'), err.toString());
		            })
    .pipe(dest('./dist/js'))
    .pipe(reload({stream: true}))
    cb()
}

const fi = require('gulp-file-include'),
inject = require('gulp-inject');

function fileInclude(cb) {
	var target = src('./src/*.html');
	    // It's not necessary to read the files (will speed up things), we're only after their paths:
	    return target //主文件
			.pipe(fi({
					prefix: '@@', //变量前缀 @@include
					basepath: './src/_include', //引用文件路径
					indent: false //保留文件的缩进
			}))
			.pipe(dest('./dist')); //输出文件路径
			cb()
}

function fileInject(cb) {
	var target = src('./src/*.html');
	var sources = src(['./src/js/*.js', './src/css/*.css'], {
	    read: false
	});
	return target //主文件
	.pipe(inject(sources, { relative: true }))
	.pipe(dest('./dist')); //输出文件路径
	cb()
}

const imageMin = require('gulp-imagemin')
// 图片
function image(cb) {
  src(['./src/images/*/*.*', './src/images/*.*'])
  .pipe(imageMin({ progressive: true }))
  .pipe(dest('./dist/images'))
  cb()
}

// 对scss/less编译，压缩，输出css文件
function css(cb) {
  src('./src/css/*.css')
  .pipe(plugins.sass({ outputStyle: 'compressed' }))
  .pipe(plugins.autoprefixer({
    cascade: false,
    remove: false
  }))
  .pipe(dest('./dist/css'))
  .pipe(reload({stream: true}))
  cb()
}

// 监听文件变化
function watcher(cb) {
  watch('./src/js/*.js', js)
  watch('./src/css/*.css', css)
  cb()
}

// 删除dist目录中的内容
function clean(cb) {
  del('./dist')
  cb()
}

function serve(cb) {
  browserSync.init({
    server: {
      baseDir: './'
    }
  })
  cb()
}

exports.scripts = js
exports.styles = css
exports.htmlMin = htmlMin
exports.clean = clean
exports.fileInclude = fileInclude
exports.fileInject = fileInject
exports.image = image
exports.default = series(
  clean,
  image,
	fileInject,
	js,
  css,
	htmlMin, 
	fileInclude,
	serve,
  watcher
  
)