var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var connect = require('gulp-connect');

gulp.task('build', function () {
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

gulp.task('connect', function() {
  connect.server({
    root: '',
    livereload: true
  });
});

gulp.task('watch', function () {
    gulp.watch('./*/*.js', ['build']);
});

gulp.task('default', ['connect', 'watch']);