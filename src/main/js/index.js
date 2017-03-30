//==================================================
//  For the description see
//  [SupeflyCSS Test Task](https://github.com/superfly-css/superfly-css-task-deploy/)
//==================================================
//  Tasks
//  ---------------------------------------------------
//  ___________________________________________________
//  ---------------------------------------------------
//  deploy:main:css
//  ---------------------------------------------------
//  Deploys main css only
//  ___________________________________________________
//  ---------------------------------------------------
//  deploy:test:css
//  ---------------------------------------------------
//  Deploys test css only
//  ___________________________________________________
//  ---------------------------------------------------
//  deploy:main:html
//  ---------------------------------------------------
//  Deploys main html only
//  ___________________________________________________
//  ---------------------------------------------------
//  Deploys test html only
//  ___________________________________________________
//  ---------------------------------------------------
//  IMPLEMENTATION
//  ---------------------------------------------------
//  deploy:main:css and deploy:test:css
//  ---------------------------------------------------
//  These tasks rerun all the plugins in configured in
//  superfly-css-task-build task.  The reason is that
//  font magician  has to be run after uncss is run.
//  That way only fonts  that are used will have a
//  corresponding @font-face declaration generated.
//  ---------------------------------------------------
//  deploy:main:html and deploy:test:html
//  ---------------------------------------------------
//  Deploying html files updates the css import directory to the `deploy`
//  directory.  In other words if the css import is currently being done like
//  this:
//  <link rel="stylesheet" type="text/css" href="../../../target/test/css/index.css">
//  After deployment it will be done like this:
//  <link rel="stylesheet" type="text/css" href="../../../deploy/test/css/index.css">
//  ---------------------------------------------------
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
var cleancss = require('gulp-clean-css');
var autoprefixer = require('autoprefixer');

var PLI = require('superfly-css-pli');

var pre_uncss_processors = [pc_import, pc_each, pc_for, pc_custom_properties, pc_apply, pc_calc, pc_color_function, pc_sass_color_functions, pc_custom_media];
var post_uncss_processors = [pc_font_magician, autoprefixer, pc_reporter({
  clearMessages: true
})];

gulp.task('deploy:main:css', function() {
  return gulp.src(PLI.SRC_MAIN_CSS)
    .pipe(pc(pre_uncss_processors))
    .pipe(uncss({
      html: [PLI.SRC_MAIN_HTML]
    }))
    .pipe(pc(post_uncss_processors))
    .pipe(cleancss({
      compatibility: 'ie8'
    }))
    .pipe(gulp.dest(PLI.deploy.main.css));
});


gulp.task('deploy:test:css', function() {
  return gulp.src(PLI.SRC_TEST_CSS)
    .pipe(pc(pre_uncss_processors))
    .pipe(uncss({
      html: [PLI.SRC_TEST_HTML]
    }))
    .pipe(pc(post_uncss_processors))
    .pipe(cleancss({
      compatibility: 'ie8'
    }))
    .pipe(gulp.dest(PLI.deploy.test.css));
});

gulp.task('deploy:main:html', function() {
  return gulp
    .src(PLI.TARGET_MAIN_HTML)
    .pipe(cheerio(function($, file) {
      $('link[href="../../../target/test/css/index.css"]').attr('href',
        $('link[href="../../../target/test/css/index.css"]').attr('href').replace('target', 'deploy'));
    }))
    .pipe(gulp.dest(PLI.deploy.main.html));
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
