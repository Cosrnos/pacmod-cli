"use strict";

const replace = require('gulp-replace');

module.exports = function (gulp, Config) {
    gulp.task('copy-public', ['clean'], function () {
        const script_path = Config.DIST_FOLDER + '/' + Config.PACKAGE_NAME + '.js?t=' + (+new Date());
        return gulp.src([Config.CWD + '/public/**/*'])
            .pipe(replace('__INCLUDE_MAIN__', script_path))
            .pipe(replace('__PACKAGE_NAME__', Config.PACKAGE_NAME))
            .pipe(gulp.dest(Config.DIST_PATH + '/'))
            .on('error', handle_error('copy-public'));
    });
}

function handle_error(source) {
    return (err) => {
        console.log("Error encountered in `" + source + "` task: ", (err && err.stack) || err);
    }
}
