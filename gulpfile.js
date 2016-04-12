/**********************************************************************
DEPENDENCIES
**********************************************************************/

var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var rename = require("gulp-rename");
var cssnano = require('gulp-cssnano'); // Minify css
var autoprefixer = require('gulp-autoprefixer');

/**********************************************************************
CSS
**********************************************************************/

gulp.task('minifyCss', function(){
	return gulp.src('./src/css/app.css')
		.pipe(sourcemaps.init())
		.pipe(autoprefixer())
		.pipe(cssnano())
		.pipe(rename('app.min.css'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('./public/css'));
});

/**********************************************************************
JAVASCRIPT
**********************************************************************/

gulp.task('concatJs', function(){
	return gulp.src(
		[
			'./src/js/**/*.js'
		]
	)
	.pipe(concat('app.js'))
	.pipe(gulp.dest('./public/js'));
});

gulp.task('minifyJs', ['concatJs'], function(){
	return gulp.src('./public/js/app.js')
		.pipe(uglify())
		.pipe(rename('app.min.js'))
		.pipe(gulp.dest('./public/js'));
});

/**********************************************************************
WATCH
**********************************************************************/

gulp.task('watch', function(){
	gulp.watch('./src/css/**/*.css', ['minifyCss']);
	gulp.watch('./src/js/**/*.js', ['minifyJs']);
});

/********************************************************************************
DEFAULT
********************************************************************************/

gulp.task('default', ['minifyCss', 'minifyJs', 'watch']);

