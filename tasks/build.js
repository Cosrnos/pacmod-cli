// Modules
const babel = require('gulp-babel');
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
        return gulp.src([Config.CWD + '/packages/**/lib/*.js', Config.CWD + '/packages/**/lib/**/*.js'])
            .pipe(rename(function (path) {
                path.dirname = path.dirname.replace('/lib', '');
            }))
            .pipe(sourcemaps.init())
            .pipe(babel({
                presets: [es2015]
            }))
            .on('error', function (err) {
                console.log("Error in es6 transpile: ", (err && err.stack) || err);
                this.emit('end');
            })
            .pipe(gulp.dest(Config.BUILD_DEST + '/tmp'))
            .on('error', handle_error('es6-commonjs'));
    });

    gulp.task('commonjs-bundle', ['clean', 'es6-commonjs'], function () {
        return browserify([Config.BUILD_DEST + '/tmp/' + Config.MAIN_PACKAGE + '/index.js'])
            .on('error', handle_error('commonjs-bundle::browserify'))
            .bundle()
            .on('error', handle_error('commonjs-bundle::browserify-bundle'))
            .pipe(source(Config.PACKAGE_NAME + '.js'))
            .pipe(buffer())
            .pipe(uglify())
            .pipe(rename(Config.PACKAGE_NAME + '.js'))
            .pipe(gulp.dest(Config.BUILD_DEST))
            .pipe(gulp.dest(Config.DIST_PATH + Config.DIST_FOLDER))
            .on('error', handle_error('commonjs-bundle'));
    });
}

function handle_error(source) {
    return (err) => {
        console.log("Error encountered in `" + source + "` task: ", (err && err.stack) || err);
    }
}
