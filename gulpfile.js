var gulp = require('gulp');
var minify = require('gulp-minifier');
var exec = require('child_process').exec;

function min(src, dest) {
  gulp.src(src).pipe(minify({
    minify: true,
    collapseWhitespace: true,
    conservativeCollapse: true,
    minifyJS: true,
    minifyCSS: true,
    minifyHTML: true
  })).pipe(gulp.dest(dest));
}

gulp.task('build', function (cb) {
  exec('node ./node_modules/webpack/bin/webpack.js --config ./webpack.config.prod.js', function (err, stdout, stderr) {
    console.log(stdout);
    console.log('webpack build success');

    gulp.src('./assets/js/**/*').pipe(gulp.dest('./dist/assets/js'));
    gulp.src('./assets/css/**/*').pipe(gulp.dest('./dist/assets/css'));
    gulp.src('./assets/img/**/*').pipe(gulp.dest('./dist/assets/img'));
    gulp.src('./assets/fonts/**/*').pipe(gulp.dest('./dist/assets/fonts'));
    gulp.src('./assets/jquery/**/*').pipe(gulp.dest('./dist/assets/jquery'));
    gulp.src('./assets/ueditor/**/*').pipe(gulp.dest('./dist/assets/ueditor'));
    gulp.src('./assets/favicon.png').pipe(gulp.dest('./dist/assets'));
    min('./build/**/*', './dist');
  });
});