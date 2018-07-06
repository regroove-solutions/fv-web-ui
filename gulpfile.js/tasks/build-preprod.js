var gulp         = require('gulp');
var gulpSequence = require('gulp-sequence');

gulp.task('build:preprod', function(cb) {
  process.env.NODE_ENV = 'preprod'
  //gulpSequence('karma', 'clean', ['fonts', 'iconFont', 'images'], ['webpack:production'], 'html', 'rev', cb);
  gulpSequence('clean', 'copy',  'copy-game-assets', ['fonts', 'images'], ['webpack:production'], ['html:preprod', 'rev'], cb);
});
