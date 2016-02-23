#! /usr/bin/env node
"use strict";

var ConfigLoader = require(__dirname + '/../config/loader.js');
var CWD = process.cwd();
var PacmodCLI = require(__dirname + '/../packages/pacmod-core/lib/index.js');
var options = Array.prototype.slice.call(process.argv, 2).join(' ');

ConfigLoader.load(CWD).then(function (pacfile) {
    PacmodCLI.CommandProcessor.execute(pacfile, options);
});
