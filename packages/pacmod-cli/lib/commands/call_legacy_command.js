"use strict";

/**
 * Deprecated gulp process spawn function
 */

var exec = require('exec');
var child_process = require('child_process');

module.exports = function call_legacy_command(options, pacfile) {
    function spawn_gulp_process() {
        var gulp_process = child_process.spawn(pacfile.__DIRNAME + 'node_modules/gulp/bin/gulp.js', Array.prototype.slice.call(arguments));

        gulp_process.stdout.pipe(process.stdout, {
            end: false
        });

        gulp_process.stderr.pipe(process.stderr);

        gulp_process.stdout.on('close', function (data) {
            if (data) {
                console.log('PACMOD ERROR: ' + data);
            }
        });
    }

    let pargs = ['--cwd=' + pacfile.__DIRNAME];

    if (options[0] === 'test') {
        pargs.push('test');
    } else if (options[0] === 'init') {
        pargs.push('init');
    }

    if (options[1] !== '-d' && options[0] !== '-d') {
        pargs.push('--silent');
    }

    pargs.push('--pacmod_dir=' + process.cwd());

    spawn_gulp_process.apply(this, pargs);
}
