"use strict";

// Gulp Dependencies
const gulp = require('gulp');
const babel = require('gulp-babel');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const replace = require('gulp-replace');
const sourcemaps = require('gulp-sourcemaps');

const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const del = require('del').sync;

const browserify = require('browserify');
const _ = require('lodash');

const config_defaults = {
    BUILD_DESTINATION: '_build',
    PACKAGE_NAME: 'pacmod',
    DIST_FOLDER: '',
    MAIN_PACKAGE: 'main'
};

// Config Vars
let tinylr;
let Config;

// Helpers
function load_config() {
    let config_file = {};

    try {
        config_file = JSON.parse(require('fs').readFileSync(__dirname + '/pacmod.json', 'utf8'));
    } catch (e) {
        let warn_obj;

        if (e.code === 'ENOENT') {
            warn_obj = "No pacmod.json file found in `" + __dirname + "`. Using pacmod default settings...";
        } else {
            warn_obj = (e && e.stack) || e;
        }

        console.log("WARNING: ", warn_obj);
    }

    return _.defaults({}, config_file, config_defaults);
}

function handle_error(source) {
    return (err) => {
        console.log("Error encountered in `" + source + "` task: ", (err && err.stack) || err);
    }
}

function get_dist_js_folder() {
    return ("dist" + Config.DIST_FOLDER);
}

function notifyLiveReload(event) {
    let fileName = require('path').relative(__dirname, event.path);

    console.log("Triggering live reload...");

    tinylr.changed({
        body: {
            files: [fileName]
        }
    });
}

Config = load_config();

// Cleaning Tasks
gulp.task('clean-build', function () {
    return del([Config.BUILD_DESTINATION]);
});

gulp.task('clean-dist', function () {
    return del(['dist']);
});

gulp.task('bundle-commonjs-clean', function () {
    return del([Config.BUILD_DESTINATION + '/commonjs']);
});

// Copy Tasks
gulp.task('copy-public', function () {
    var script_path = Config.DIST_FOLDER + '/' + Config.PACKAGE_NAME + '.js?t=' + (+new Date());
    return gulp.src(['public/**/*'])
        .pipe(replace('__INCLUDE_MAIN__', script_path))
        .pipe(replace('__PACKAGE_NAME__', Config.PACKAGE_NAME))
        .pipe(gulp.dest('dist/'))
        .on('error', handle_error('copy-public'));
});

// Build Tasks
gulp.task('es6-commonjs', function () {
    return gulp.src(['packages/**/lib/*.js', 'packages/**/lib/**/*.js'])
        .pipe(rename(function (path) {
            path.dirname = path.dirname.replace('/lib', '');
        }))
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .on('error', function (err) {
            console.log("Error in es6 transpile: ", (err && err.stack) || err);
            this.emit('end');
        })
        .pipe(gulp.dest(Config.BUILD_DESTINATION + '/tmp'))
        .on('error', handle_error('es6-commonjs'));
});

gulp.task('commonjs-bundle', ['bundle-commonjs-clean', 'es6-commonjs'], function () {
    return browserify([Config.BUILD_DESTINATION + '/tmp/' + Config.MAIN_PACKAGE + '/index.js'])
        .on('error', handle_error('commonjs-bundle::browserify'))
        .bundle()
        .on('error', handle_error('commonjs-bundle::browserify-bundle'))
        .pipe(source(Config.PACKAGE_NAME + '.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(rename(Config.PACKAGE_NAME + '.js'))
        .pipe(gulp.dest(Config.BUILD_DESTINATION))
        .pipe(gulp.dest(get_dist_js_folder()))
        .on('error', handle_error('commonjs-bundle'));
});

// Serve Tasks
gulp.task('express', function () {
    let express = require('express');
    let app = express();
    app.use(require('connect-livereload')({ port: 35729 }));
    app.use(express.static(__dirname + '/dist'));
    app.listen(4000, '0.0.0.0');
});

gulp.task('watch', function () {
    gulp.watch('packages/**/*.js', ['build']);
    gulp.watch('dist/**/*', notifyLiveReload);
    gulp.watch('public/**/*', ['copy-public'], notifyLiveReload);
});

gulp.task('livereload', function () {
    tinylr = require('tiny-lr')();
    tinylr.listen(35729);
});

// Aliases
gulp.task('clean', ['clean-build', 'clean-dist'])
gulp.task('build', ['commonjs-bundle', 'copy-public']);
gulp.task('serve', ['express', 'livereload', 'watch']);
gulp.task('dev', ['clean', 'build', 'serve']);

gulp.task('default', ['dev']);