var gulp = require('gulp');
var uncss = require('gulp-uncss');

var PLI = require('superfly-css-pli');


gulp.task('deploy:css', function() {
  gulp.src(PLI.TARGET_MAIN_CSS)
    .pipe(uncss({
      html: [PLI.TARGET_MAIN_HTML]
    }))
    .pipe(gulp.dest(PLI.deploy.main.css));

  gulp.src(PLI.TARGET_TEST_CSS)
    .pipe(uncss({
      html: [PLI.TARGET_TEST_HTML]
    }))
    .pipe(gulp.dest(PLI.deploy.test.css));

  gulp
    .src(PLI.TARGET_MAIN_HTML)
    .pipe(gulp.dest(PLI.deploy.main.html));

  return gulp
    .src(PLI.TARGET_TEST_HTML)
    .pipe(gulp.dest(PLI.deploy.test.html));
});
