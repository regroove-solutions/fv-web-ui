let config      = require('../config/');
let gulp        = require('gulp');
const BUILD_DIR = 'public';
const NUXEO_GLOB = 'nuxeo/**/*';
const NUXEO_TARGET = 'target/classes/';
const NUXEO_DIR = NUXEO_TARGET + 'nuxeo.war/app';
const SRC_DIR = 'src/';

gulp.task('copyTmp:nuxeo', ['build:production'], () => {
    return gulp.src(`${BUILD_DIR}/**/*`).pipe(gulp.dest(NUXEO_DIR));
  });

gulp.task('copy:nuxeo', ['copyTmp:nuxeo'], () => {
    return gulp.src(NUXEO_GLOB).pipe(gulp.dest(NUXEO_TARGET));
  });