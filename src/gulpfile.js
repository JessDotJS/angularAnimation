// gulp
var gulp = require('gulp');

// plugins
var connect = require('gulp-connect');
//var jshint = require('gulp-jshint');
var ignore = require('gulp-ignore');
var uglify = require('gulp-uglify');
var cleanCss = require('gulp-clean-css');
var clean = require('gulp-clean');
var sass = require('gulp-sass');
var runSequence = require('run-sequence');



gulp.task('sass', function () {
    return gulp.src('./dev/*.scss')
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(gulp.dest('./dev'));
});

gulp.task('minify-css', function() {
    gulp.src(['./dev/*.css'])
        .pipe(cleanCss())
        .pipe(gulp.dest('./dist/'))
});

gulp.task('minify-js', function() {
    gulp.src(['./dev/*.js', '!./dev/vendors/**'])

        .pipe(uglify({
            // inSourceMap:
            // outSourceMap: "app.js.map"
        }))
        .pipe(gulp.dest('./dist'))
});


gulp.task('copy-vendors', function () {
    gulp.src(['./dev/vendors/**'])
        .pipe(gulp.dest('dist/vendors'));
});


gulp.task('clean', function() {
    gulp.src(['./dist/*'])
        .pipe(clean({force: true}));
});


gulp.task('dist', function() {
    runSequence(
        ['clean'],
        ['sass'],
        ['minify-css', 'minify-js']
    );
});