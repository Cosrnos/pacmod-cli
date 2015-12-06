"use strict";

const _ = require('lodash');

const DEFAULTS = {
    BUILD_DESTINATION: '_build',
    PACKAGE_NAME: 'pacmod',
    DIST_FOLDER: '',
    MAIN_PACKAGE: 'main',
    PORT: 4000,
    TEST_DESTINATION: '_test',
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
        contents = JSON.parse(require('fs').readFileSync(path, 'utf8'));
    } catch (e) {
        let warn_obj;

        if (e.code === 'ENOENT') {
            warn_obj = "No config file found in current directory. Using pacmod default settings...";
        } else {
            warn_obj = (e && e.stack) || e;
        }

        console.log("WARNING: ", warn_obj);
    }

    return contents;
}