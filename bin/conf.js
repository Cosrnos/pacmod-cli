"use strict";

const _ = require('lodash');

const DEFAULTS = {
    BUILD_DESTINATION: '_build',
    PACKAGE_NAME: 'pacmod',
    DIST_FOLDER: '',
    MAIN_PACKAGE: 'main',
    PORT: 4000
};

function add_virtuals(Config) {
    let virtuals = {
        DIST_PATH: Config.CWD + '/dist',
        BUILD_DEST: Config.CWD + '/' + Config.BUILD_DESTINATION
    };

    return _.defaults({}, Config, virtuals);
};

module.exports = function (CWD) {
    let config_file = {};

    try {
        config_file = JSON.parse(require('fs').readFileSync(CWD + '/pacmod.json', 'utf8'));
    } catch (e) {
        let warn_obj;

        if (e.code === 'ENOENT') {
            warn_obj = "No pacmod.json file found in `" + CWD + "`. Using pacmod default settings...";
        } else {
            warn_obj = (e && e.stack) || e;
        }

        console.log("WARNING: ", warn_obj);
    }

    let Config = _.defaults({
        CWD: CWD
    }, config_file, DEFAULTS);

    return add_virtuals(Config);
};