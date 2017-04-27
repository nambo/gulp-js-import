var gulp = require('gulp');
var jsImport = require('gulp-js-import');

gulp.task('import', function() {
  return gulp.src('index.js')
        .pipe(jsImport())
        .pipe(gulp.dest('dist'));
});