var config  = require('../config');
var fs = require('fs');
var gulp = require('gulp');
var tap = require('gulp-tap');

var name = "First People's Cultural Council";
var licenseHeader = fs.readFileSync('./license-header-template.txt', 'utf8').replace('{name}', name);

gulp.task('license-insert', function() {
  return gulp.src(config.sourceAssets + '/*/*.js')
  	.pipe(tap(function(file, t) {
  		if (file.contents.indexOf(licenseHeader) == -1 ) {
		    file.contents = Buffer.concat([
		        new Buffer(licenseHeader),
		        file.contents
		    ]);
		}
    }))
    .pipe(gulp.dest(config.sourceAssets));
});
