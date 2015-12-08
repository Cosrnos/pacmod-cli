#! /usr/bin/env node
"use strict";

var gulp;
var exec = require('exec');
var child_process = require('child_process');
var options = Array.prototype.slice.call(process.argv, 2);

function spawn_gulp_process() {
    var gulp_process = child_process.spawn(__dirname + '/../node_modules/gulp/bin/gulp.js', Array.prototype.slice.call(arguments));

    gulp_process.stdout.pipe(process.stdout, {
        end: false
    });

    gulp_process.stderr.pipe(process.stderr);

    gulp_process.stdout.on('close', function (data) {
        console.log('stdout: ' + data);
    });
}

let pargs = ['--cwd=' + __dirname];

if (options[0] === 'test') {
    pargs.push('test');
}

if (options[1] !== '-d' && options[0] !== '-d') {
    pargs.push('--silent');
}

pargs.push('--pacmod_dir=' + process.cwd());

spawn_gulp_process.apply(this, pargs);