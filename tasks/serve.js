"use strict";

const open = require('open');

let tinylr;

module.exports = function (gulp, Config) {
    gulp.task('express', ['build'], function () {
        let express = require('express');
        let app = express();
        app.use(require('connect-livereload')({ port: 35729 }));
        console.log("Serving from " + Config._BUILD_TARGET_PATH);
        app.use(express.static(Config._BUILD_TARGET_PATH));
        app.listen(Config.PORT, '0.0.0.0');
    });

    gulp.task('watch', ['express'], function () {
        gulp.watch(Config.CWD + '/packages/**/*.js', ['build']);
        gulp.watch(Config.CWD + '/dist/**/*', notifyLiveReload);
        gulp.watch(Config.CWD + '/public/**/*', ['copy-public'], notifyLiveReload);

        console.log("Pacmod ready! Listening on port " + Config.PORT);
        open('http://localhost:' + Config.PORT);
    });

    gulp.task('express-test', ['build-test'], function () {
        let express = require('express');
        let app = express();
        app.use(require('connect-livereload')({ port: 35730 }));
        app.use(express.static(Config._TEST_FOLDER_PATH));
        app.listen(Config.TEST_PORT, '0.0.0.0');
    });

    gulp.task('watch-test', ['express-test'], function () {
        gulp.watch(Config.CWD + '/packages/**/*.js', ['concat-test', 'build-test']);
        gulp.watch(Config._TEST_FOLDER_PATH + '/**/*', notifyLiveReload);
        gulp.watch(Config.CWD + '/public/**/*', ['copy-test-template'], notifyLiveReload);

        console.log("Pacmod ready! Listening on port " + Config.TEST_PORT);
        open('http://localhost:' + Config.TEST_PORT + '/test.html');
    });

    gulp.task('livereload', function () {
        tinylr = require('tiny-lr')();
        tinylr.listen(35729);
    });

    gulp.task('livereload-test', function () {
        tinylr = require('tiny-lr')();
        tinylr.listen(35730);
    });

    function notifyLiveReload(event) {
        let fileName = require('path').relative(Config.CWD, event.path);

        console.log("Triggering live reload...");

        tinylr.changed({
            body: {
                files: [fileName]
            }
        });
    }
};
