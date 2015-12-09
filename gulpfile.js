"use strict";

const gulp = require('gulp');
const _ = require('lodash');

const ConfigLoader = require('./config/loader.js');

// Config Vars
let CWD = process.cwd();

// Load Arguments to parse any cwd changes
_.each(process.argv, (arg)=> {
    if (arg.indexOf('--pacmod_dir') > -1) {
        // Set the current working directory to the arg
        let arg_split = arg.split('=');
        CWD = arg_split[1];
    }
});

/**
 * Initialize config with working directory
 * !! THIS HAPPENS SYNCHRONOUSLY !!
 */
ConfigLoader.load(CWD)
    .then((Config) => {
        // Tasks
        require('./tasks/clean.js')(gulp, Config);
        require('./tasks/copy.js')(gulp, Config);
        require('./tasks/build.js')(gulp, Config);
        require('./tasks/serve.js')(gulp, Config);

        // Aliases
        gulp.task('clean', ['clean-build', 'clean-dist'])
        gulp.task('build', ['commonjs-bundle', 'copy-public']);
        gulp.task('serve', ['express', 'livereload', 'watch']);
        gulp.task('test', ['clean', 'concat-test', 'build', 'build-test', 'copy-test-template', 'serve-test']);
        gulp.task('serve-test', ['express-test', 'livereload-test', 'watch-test']);
        gulp.task('dev', ['clean', 'build', 'serve']);

        gulp.task('default', ['dev']);
    })
    .catch((err) => {
        console.log("PACMOD: Error encountered:", (err && err.stack) || err);
    });
