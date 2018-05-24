var gulp = require('gulp');

var config = require('../config');
var htmlConfig = require('../config/html')('development');
var clean = require('gulp-clean');

/**
 * @author Charlie
 */
gulp.task('clean', function(){
  return gulp.src([config.publicAssets, htmlConfig.dest], {read:false}).pipe(clean());
})
