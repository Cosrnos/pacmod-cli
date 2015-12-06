var del = require('del');

module.exports = function (gulp, Config) {
    gulp.task('clean-build', clean_directory(Config.BUILD_DEST));
    gulp.task('clean-dist', ['clean-build'], clean_directory(Config.DIST_FOLDER));
    gulp.task('bundle-commonjs-clean', ['clean-dist'], clean_directory(Config.BUILD_DEST + '/commonjs'));
};

// Helpers
function clean_directory(path) {
    next_count = 0;

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