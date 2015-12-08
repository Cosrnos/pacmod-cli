"use strict";

const _ = require('lodash');

// TODO: Use lower case variables
const DEFAULTS = {
    // Basic
    PACKAGE_NAME: 'pacmod',
    MAIN_PACKAGE: 'main',

    // Build
    BUILD_DESTINATION: '_build', // TODO: Rename to TEMP_FOLDER

    // Dist
    DIST_FOLDER: '', // TODO: Rename to BUILD_TARGET

    // Serve
    PORT: 4000,

    // Testing
    TEST_DESTINATION: '_test', // TODO: Use the TEMP_FOLDER variable and a test directory, temp test destination shouldn't matter
    TEST_PORT: 4001
};

module.exports = function (CWD) {
    let config_file = load_pacmod_config(CWD + '/pacmod.json');

    let Config = _.defaults({
        CWD: CWD
    }, config_file, DEFAULTS);

    return add_virtuals(Config);
};

function add_virtuals(Config) {
    let virtuals = {
        DIST_PATH: Config.CWD + '/dist',
        TEST_DEST: Config.CWD + '/' + Config.TEST_DESTINATION,
        BUILD_DEST: Config.CWD + '/' + Config.BUILD_DESTINATION
    };

    return _.defaults({}, Config, virtuals);
};

function load_pacmod_config(path) {
    let contents = {};

    try {
        // Blocking behavior implimented since we rely on the config for everything
        contents = JSON.parse(require('fs').readFileSync(path, 'utf8'));
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