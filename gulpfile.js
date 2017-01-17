// gulp
var gulp = require('gulp');

// plugins
var connect = require('gulp-connect');
//var jshint = require('gulp-jshint');
var ignore = require('gulp-ignore');
var uglify = require('gulp-uglify');
var cleanCss = require('gulp-clean-css');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');




gulp.task('minify-css', function() {
    gulp.src(['./dev/assets/css/*.css'])
        .pipe(cleanCss())
        .pipe(gulp.dest('./app/assets/css'))
});

gulp.task('minify-js', function() {
    gulp.src(['./dev/**/*.js', '!./dev/vendors/**'])

        .pipe(uglify({
            // inSourceMap:
            // outSourceMap: "app.js.map"
        }))
        .pipe(gulp.dest('./app'))
});

gulp.task('copy-assets', function () {
    gulp.src(['./dev/assets/**', '!./dev/assets/css/**'])
        .pipe(gulp.dest('app/assets'));
});

gulp.task('copy-vendors', function () {
    gulp.src(['./dev/vendors/**'])
        .pipe(gulp.dest('app/vendors'));
});

gulp.task('copy-html-files', function () {
    gulp.src(['./dev/**/*.html'])
        .pipe(gulp.dest('app'));
});

gulp.task('clean', function() {
    gulp.src(['./app/*'])
        .pipe(clean({force: true}));
});






gulp.task('connect-dev', function () {
    connect.server({
        root: 'dev/',
        port: 2222
    });
});

gulp.task('connect-build', function () {
    connect.server({
        root: 'build/',
        port: 7777
    });
});



gulp.task('default', ['connect-dev']);

gulp.task('build', function() {
    runSequence(
        ['clean'],
        ['copy-vendors', 'copy-assets', 'minify-css', 'minify-js', 'copy-html-files', 'connect-build']
    );
});