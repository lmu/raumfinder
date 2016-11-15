var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var ngAnnotate = require('gulp-ng-annotate');

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
        //.pipe(sourcemaps.init())
        .pipe(concat('build.js'))
        //.pipe(ngAnnotate())
        .pipe(uglify())
        //.pipe(sourcemaps.write())
        .pipe(gulp.dest('.'));
})


gulp.task('watch', ['js'], function () {
    gulp.watch('./**/*.js', ['js'])
})