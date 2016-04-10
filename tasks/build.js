// Modules
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const replace = require('gulp-replace');
const sourcemaps = require('gulp-sourcemaps');
const es2015 = require('babel-preset-es2015');

const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

const browserify = require('browserify');

module.exports = function (gulp, Config) {
  gulp.task('es6-commonjs', ['clean'], function () {
    return gulp.src([Config.CWD + '/packages/**/*.js', Config.CWD + '/packages/**/*.js'])
      .pipe(rename(function (path) {
        // Tests should be preserved in /tests directory of package
        path.dirname = path.dirname.replace('/lib', '');
      }))
      .pipe(sourcemaps.init())
      .pipe(babel({
        presets: [es2015]
      }))
      .on('error', function (err) {
        console.log("Error in es6 transpile: ", (err && err.stack) || err);
        // Prevent gulp from ending the process
        this.emit('end');
      })
      .pipe(gulp.dest(Config._TEMP_FOLDER_PATH + '/tmp'))
      .on('error', handle_error('es6-commonjs'));
  });

  gulp.task('commonjs-bundle', ['clean', 'es6-commonjs'], function () {
    return browserify([Config._TEMP_FOLDER_PATH + '/tmp/' + Config.MAIN_PACKAGE + '/index.js'])
      .on('error', handle_error('commonjs-bundle::browserify'))
      .bundle()
      .on('error', handle_error('commonjs-bundle::browserify-bundle'))
      .pipe(source(Config.PACKAGE_NAME + '.js'))
      .on('error', handle_error('commonjs-bundle'))
      .pipe(buffer())
      .on('error', handle_error('commonjs-bundle'))
      //.pipe(uglify())
      //.on('error', handle_error('commonjs-bundle'))
      .pipe(rename(Config.PACKAGE_NAME + '.js'))
      .on('error', handle_error('commonjs-bundle'))
      .pipe(gulp.dest(Config._TEMP_FOLDER_PATH))
      .on('error', handle_error('commonjs-bundle'))
      .pipe(gulp.dest(Config._BUILD_TARGET_PATH + Config.SCRIPT_PATH))
      .on('error', handle_error('commonjs-bundle'));
  });

  gulp.task('concat-test', ['clean', 'commonjs-bundle'], function () {
    return gulp.src([Config._TEMP_FOLDER_PATH + '/tmp/**/tests/*.js'])
      .pipe(concat('tmp/tests.js'))
      .on('error', handle_error('concat-test'))
      .pipe(gulp.dest(Config._TEMP_FOLDER_PATH))
      .on('error', handle_error('concat-test'))
  });

  gulp.task('build-test', ['concat-test', 'copy-test-template'], function () {
    return browserify([Config._TEMP_FOLDER_PATH + '/tmp/tests.js'])
      .on('error', handle_error('test-bundle::browserify'))
      .bundle()
      .on('error', handle_error('test-bundle::browserify-bundle'))
      .pipe(source(Config.PACKAGE_NAME + '-tests.js'))
      .on('error', handle_error('build-test'))
      .pipe(buffer())
      .on('error', handle_error('build-test'))
      //.pipe(uglify())
      //.on('error', handle_error('build-test'))
      .pipe(rename(Config.PACKAGE_NAME + '-tests.js'))
      .on('error', handle_error('build-test'))
      .pipe(gulp.dest(Config._TEMP_FOLDER_PATH))
      .on('error', handle_error('build-test'))
      .pipe(gulp.dest(Config._TEST_FOLDER_PATH))
      .on('error', handle_error('build-test'));
  });
}

function handle_error(source) {
  return (err) => {
    console.log("Error encountered in `" + source + "` task: ", (err && err.stack) || err);
  }
}
