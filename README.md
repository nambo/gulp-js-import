First, install gulp-js-import as a devDependency:
```
npm install gulp-js-import --save-dev
```
Then add it to the gulpfile.js:

```
var jsImport = require('gulp-js-import');
 
gulp.task('import', function () {
    gulp.src('./index.js')
        .pipe(jsImport())
        .pipe(gulp.dest('dist')); 
})
```