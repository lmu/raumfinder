var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
//var sourcemaps = require('gulp-sourcemaps');
//var ngAnnotate = require('gulp-ng-annotate');
var connect = require('gulp-connect');

gulp.task('default', [ 'webserver','watch']);

gulp.task('js', function () {
    gulp.src(['./json/*.json', ])
      .pipe(concat('data.json'))
      .pipe(uglify())
      .pipe(gulp.dest('.'));

    gulp.src(['./js/*.js',
              './app.js',
              './filter/*.js',
              './controller/*.js',
              './service/*.js'])
        .pipe(concat('build.js'))
        .pipe(uglify())
        .pipe(gulp.dest('.'));
});


gulp.task('watch', ['js'], function () {
    gulp.watch('./**/*.js', ['js'])
});


gulp.task('webserver', function () {
    connect.server({
        livereload: true,
        root: '/'
    });
});



