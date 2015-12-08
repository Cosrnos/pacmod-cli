"use strict";

const _ = require('lodash');
const fs = require('fs');

const default_config_values = require('./defaults.js')

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