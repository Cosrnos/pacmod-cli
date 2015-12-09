var del = require('del');

module.exports = function (gulp, Config) {
    gulp.task('clean-build', clean_directory(Config._TEMP_FOLDER_PATH));
    gulp.task('clean-dist', ['clean-build'], clean_directory(Config._BUILD_TARGET_PATH));
    gulp.task('bundle-commonjs-clean', ['clean-dist'], clean_directory(Config._TEMP_FOLDER_PATH + '/commonjs'));
};

// Helpers
function clean_directory(path) {
    return function __clean_dir(next) {
        del([path], {
            force: true
        }).then(()=> {
            return next();
        }).catch((err) => {
            console.log('Error cleaning directory `' + path + '`: ' + err);
            return next();
        });
    }
}