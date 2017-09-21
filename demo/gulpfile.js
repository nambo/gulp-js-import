var gulp = require('gulp');
var jsImport = require('gulp-js-import');

gulp.task('import', function() {
  return gulp.src('index.js')
        .pipe(jsImport({hideConsole: true}))
        .pipe(gulp.dest('dist'));
});