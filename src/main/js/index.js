//==================================================
//  For the description see
//  [SupeflyCSS Test Task](https://github.com/superfly-css/superfly-css-task-deploy/)
//==================================================
//  Tasks
//  ---------------------------------------------------
//  deploy
//  ---------------------------------------------------
//  Deploys both main and test css and test html
//  ___________________________________________________
//  ---------------------------------------------------
//  deploy:css
//  ---------------------------------------------------
//  Deploys main and test css only
//  ___________________________________________________
//  ---------------------------------------------------
//  deploy:html
//  ---------------------------------------------------
//  Deploys main and test css only
//  ___________________________________________________
//  ---------------------------------------------------
//  IMPLEMENTATION
//  ---------------------------------------------------
//  deploy:css
//  ---------------------------------------------------
//  This reruns the all the plugins in configured in
//  superfly-css-task-build.  The reason is that font magician
//  has to be run after uncss is run.  That way only fonts
//  that are used have @font-face declarations generated.
//  Main and test css is sourced and the result of the task
//  is output to the corresponding deploy directories.
//  ---------------------------------------------------
//  deploy:html
//  ---------------------------------------------------
//  This updates the css import of the corresponding test html
//  files.  Only the reference to the `index.css` file is updated.
//  In other words:
//  <link rel="stylesheet" type="text/css" href="../../../target/test/css/index.css">
//  turns into:
//  <link rel="stylesheet" type="text/css" href="../../../deploy/test/css/index.css">
//  ---------------------------------------------------
//
//  1: Cheerio copies content from `Test-markup`
//     and appends it to the markup to the `Test-render`
//
//==================================================

var gulp = require('gulp');
var cheerio = require('gulp-cheerio');
var pc = require('gulp-postcss');
var pc_import = require('postcss-import');
var pc_calc = require('postcss-calc');
var pc_custom_properties = require('postcss-custom-properties');
var pc_color_function = require('postcss-color-function');
var pc_sass_color_functions = require("postcss-sass-color-functions");
var pc_each = require('postcss-each');
var pc_for = require('postcss-for');
var pc_apply = require('postcss-apply');
var pc_reporter = require('postcss-reporter');
var pc_custom_media = require('postcss-custom-media');
var pc_font_magician = require('postcss-font-magician');

var uncss = require('gulp-uncss');
var autoprefixer = require('autoprefixer');

var PLI = require('superfly-css-pli');

var pre_uncss_processors = [pc_import, pc_each, pc_for, pc_custom_properties, pc_apply, pc_calc, pc_color_function, pc_sass_color_functions, pc_custom_media];
var post_uncss_processors = [pc_font_magician, autoprefixer, pc_reporter({
  clearMessages: true
})];

gulp.task('deploy:test:css', function() {
  return gulp.src(PLI.SRC_TEST_CSS)
    .pipe(pc(pre_uncss_processors))
    .pipe(uncss({
      html: [PLI.TARGET_TEST_HTML]
    }))
    .pipe(pc(post_uncss_processors))
    .pipe(gulp.dest(PLI.deploy.test.css));
});

gulp.task('deploy:test:html', function() {
  return gulp
    .src(PLI.TARGET_TEST_HTML)
    .pipe(cheerio(function($, file) {
      $('link[href="../../../target/test/css/index.css"]').attr('href',
        $('link[href="../../../target/test/css/index.css"]').attr('href').replace('target', 'deploy'));
    }))
    .pipe(gulp.dest(PLI.deploy.test.html));
});

/*

gulp.task('deploy:css', function() {
  gulp
    .src(PLI.SRC_MAIN_HTML)
    .pipe(gulp.dest(PLI.deploy.main.html));

  return gulp
    .src(PLI.SRC_TEST_HTML)
    .pipe(gulp.dest(PLI.deploy.test.html));
});


gulp.task('deploy:main', function() {

  gulp.src(PLI.TARGET_MAIN_CSS)
    .pipe(uncss({
      html: [PLI.TARGET_MAIN_HTML]
    }))
    .pipe(gulp.dest(PLI.deploy.main.css));

  return gulp
    .src(PLI.TARGET_MAIN_HTML)
    .pipe(gulp.dest(PLI.deploy.main.html));
});

gulp.task('deploy:test', function() {

  gulp.src(PLI.TARGET_TEST_CSS)
    .pipe(uncss({
      html: [PLI.TARGET_TEST_HTML]
    }))
    .pipe(gulp.dest(PLI.deploy.test.css));

  return gulp
    .src(PLI.TARGET_TEST_HTML)
    .pipe(gulp.dest(PLI.deploy.test.html));
});
*/
