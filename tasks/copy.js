"use strict";

const replace = require('gulp-replace');
const rename = require('gulp-rename');

module.exports = function (gulp, Config) {
    const script_path = Config.SCRIPT_PATH + '/' + Config.PACKAGE_NAME + '.js?t=' + (+new Date());
    const test_path = Config.SCRIPT_PATH + '/' + Config.PACKAGE_NAME + '-tests.js?t=' + (+new Date());

    gulp.task('copy-public', ['clean'], function () {
        return gulp.src([Config.CWD + '/public/**/*'])
            .on('error', handle_error('copy-public'))
            .pipe(replace('__INCLUDE_MAIN__', script_path))
            .on('error', handle_error('copy-public'))
            .pipe(replace('__PACKAGE_NAME__', Config.PACKAGE_NAME))
            .on('error', handle_error('copy-public'))
            .pipe(gulp.dest(Config._BUILD_TARGET_PATH + '/'))
            .on('error', handle_error('copy-public'));
    });

    gulp.task('copy-test-template', ['clean'], function () {
        return gulp.src([__dirname + '/../templates/test.html'])
            .on('error', handle_error('copy-test-template'))
            .pipe(replace('__INCLUDE_MAIN__', script_path))
            .on('error', handle_error('copy-test-template'))
            .pipe(replace('__INCLUDE_TEST__', test_path))
            .on('error', handle_error('copy-test-template'))
            .pipe(replace('__PACKAGE_NAME__', Config.PACKAGE_NAME))
            .on('error', handle_error('copy-test-template'))
            .pipe(gulp.dest(Config._TEST_FOLDER_PATH + '/'))
            .on('error', handle_error('copy-test-template'));
    });

    gulp.task('copy-public-template', ['clean'], function () {
        return gulp.src([__dirname + '/../templates/public/**/*'])
            .on('error', handle_error('copy-public-template'))
            .pipe(replace('__INCLUDE_MAIN__', script_path))
            .on('error', handle_error('copy-public-template'))
            .pipe(replace('__INCLUDE_TEST__', test_path))
            .on('error', handle_error('copy-public-template'))
            .pipe(replace('__PACKAGE_NAME__', Config.PACKAGE_NAME))
            .on('error', handle_error('copy-public-template'))
            .pipe(gulp.dest(Config.CWD + '/public'))
            .on('error', handle_error('copy-public-template'));
    });

    gulp.task('copy-package-template', function () {
        return gulp.src([__dirname + '/../templates/packages/**/*'])
            .on('error', handle_error('copy-package-template'))
            .pipe(gulp.dest(Config.CWD + '/packages'))
            .on('error', handle_error('copy-package-template'))
    });
}

function handle_error(source) {
    return (err) => {
        console.log("Error encountered in `" + source + "` task: ", (err && err.stack) || err);
    }
}
