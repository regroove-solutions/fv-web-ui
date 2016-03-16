var config      = require('../config/');
var gulp        = require('gulp');

gulp.task('copy', function() {
    return gulp.src(['./node_modules/alloyeditor/dist/alloy-editor/**/*'])
        .pipe(gulp.dest(config.publicAssets + '/vendor/alloyeditor'));
});
