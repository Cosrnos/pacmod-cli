"use strict";

const open = require('open');

let tinylr;

module.exports = function (gulp, Config) {
    gulp.task('express', ['build'], function () {
        let express = require('express');
        let app = express();
        app.use(require('connect-livereload')({ port: 35729 }));
        app.use(express.static(Config.DIST_PATH));
        app.listen(Config.PORT, '0.0.0.0');
    });

    gulp.task('watch', ['express'], function () {
        gulp.watch(Config.CWD + '/packages/**/*.js', ['build']);
        gulp.watch(Config.CWD + '/dist/**/*', notifyLiveReload);
        gulp.watch(Config.CWD + '/public/**/*', ['copy-public'], notifyLiveReload);

        console.log("Pacmod ready! Listening on port " + Config.PORT);
        open('http://localhost:' + Config.PORT);
    });

    gulp.task('livereload', function () {
        tinylr = require('tiny-lr')();
        tinylr.listen(35729);
    });
}

function notifyLiveReload(event) {
    let fileName = require('path').relative(Config.CWD, event.path);

    console.log("Triggering live reload...");

    tinylr.changed({
        body: {
            files: [fileName]
        }
    });
}