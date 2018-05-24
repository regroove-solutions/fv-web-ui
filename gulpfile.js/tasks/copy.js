var config      = require('../config/');
var gulp        = require('gulp');

gulp.task('copy', function() {
    return gulp.src(['./node_modules/alloyeditor/dist/alloy-editor/**/*'])
        .pipe(gulp.dest(config.publicAssets + '/vendor/alloyeditor'))
});

gulp.task('copy-game-assets',function() {
    return gulp.src(['./app/assets/games/*/assets/**/*']).pipe(gulp.dest(config.publicAssets + '/games'));
});

gulp.task('copy-piwik-tracker',function() {
    return gulp.src(['./app/assets/javascripts/piwik.js']).pipe(gulp.dest(config.publicAssets + '/vendor/'));
});