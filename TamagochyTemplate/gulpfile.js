/// <binding AfterBuild='default' />
var gulp = require('gulp');
var concat = require('gulp-concat');


gulp.task('default', function () {
    gulp.src(['!./gulpfile.js', '!./node_modules/**', '!./minified/**', './**/*.js'])
        .pipe(concat('bundled.js'))
        .pipe(gulp.dest('minified'));
});