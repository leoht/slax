var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('js', function () {
  gulp.src(["src/**/*.js"])
    .pipe(concat("build.js"))
    .pipe(gulp.dest("public/"))
});

gulp.task('watch', function () {
  gulp.watch(["src/**/*.js"], ['js']);
})

gulp.task('default', ['js', 'watch']);
