"use strict";

const _ = require('lodash');
const fs = require('fs');

// TODO: Use lower case variables
const default_config_values = {
    // Basic
    PACKAGE_NAME: 'pacmod', // TODO: Default to package.json name if available
    MAIN_PACKAGE: 'main',

    // Build
    TEMP_FOLDER: '_build',

    // Dist
    BUILD_TARGET: 'dist',
    SCRIPT_PATH: '',

    // Serve
    PORT: 4000,

    // Testing
    TEST_PORT: 4001
};

module.exports = function (CWD) {
    let config_file = load_pacmod_config(CWD + '/pacmod.json');

    let Config = _.defaults({
        CWD: CWD
    }, config_file, default_config_values);

    return add_virtuals(Config);
};

function add_virtuals(Config) {
    var virtuals = {
        _BUILD_TARGET_PATH: Config.CWD + Config.BUILD_TARGET,
        _TEMP_FOLDER_PATH: Config.CWD + '/' + Config.TEMP_FOLDER
    };

    virtuals._TEST_FOLDER_PATH = virtuals._TEMP_FOLDER_PATH + '/tests';

    return _.defaults({}, Config, virtuals);
};

function load_pacmod_config(path) {
    let contents = {};

    try {
        // Blocking behavior implimented since we rely on the config for everything
        contents = JSON.parse(fs.readFileSync(path, 'utf8'));
    } catch (e) {
        let warn_obj;

        // TODO: Better error detection/handling
        if (e.code === 'ENOENT') {
            warn_obj = "No config file found in current directory. Using pacmod default settings...";
        } else {
            warn_obj = (e && e.stack) || e;
        }

        console.log("WARNING: ", warn_obj);
    }

    return contents;
}