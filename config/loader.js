"use strict";

// Modules
const _ = require('lodash');
const fs = require('fs');
const RSVP = require('rsvp');

// Packages
const Utils = require('../packages/pacmod-utils/lib/index.js');

// Fixtures
const default_config_values = require('./defaults.js');

const folder_config_keys = ['BUILD_TARGET', 'TEMP_FOLDER', 'SCRIPT_PATH'];

// Public API
module.exports = {
    /**
     * Loads configuration data based on the current working directory
     * @param CWD
     * @returns {Promise.<T>|*|Promise} - Resolves with final configuration data
     */
    load: function (CWD) {
        return load_config_files(CWD)
            .then(merge_config_defaults)
            .then(add_virtuals);
    }
};

// Private Functions
/**
 * Loads the configuration files in the given working directory
 * @param CWD
 * @returns {*} - Resolves with the merged file data
 */
function load_config_files(CWD) {
    return new RSVP.Promise((resolve, reject) => {
        RSVP.hash({
                package_data: load_package_file(CWD + '/package.json'),
                config_data: load_pacmod_config(CWD + '/pacmod.json')
            })
            .then((file_data) => {
                return merge_config_file_data(file_data, CWD);
            })
            .then(resolve)
            .catch(reject);
    });
}

/**
 * Merges default configuration data into existing config.
 * @param config
 */
function merge_config_defaults(config) {
    return _.defaults({
        CWD: config.CWD
    }, config, default_config_values);
}

/**
 * Adds virtual config properties to the given config object
 * @param Config
 */
function add_virtuals(Config) {
    var configCopy = Object.assign({}, Config);

    Utils.DEFINE_GET_PROPERTY(configCopy, '_BUILD_TARGET_PATH', () => {
        return configCopy.CWD + configCopy.BUILD_TARGET
    });

    Utils.DEFINE_GET_PROPERTY(configCopy, '_TEMP_FOLDER_PATH', () => {
        return configCopy.CWD + configCopy.TEMP_FOLDER;
    });

    Utils.DEFINE_GET_PROPERTY(configCopy, '_TEST_FOLDER_PATH', () => {
        return configCopy._TEMP_FOLDER_PATH + '/tests';
    });

    return configCopy;
};

/**
 * Merges loaded file objects into one
 * @param files
 * @param CWD
 * @returns {void|*}
 */
function merge_config_file_data(files, CWD) {
    var package_data = files.package_data;
    var config_data = files.config_data;

    var merge_data = Object.assign({}, config_data);

    merge_data.CWD = CWD;

    if (package_data.name && !merge_data.PACKAGE_NAME) {
        merge_data.PACKAGE_NAME = package_data.name;
    }

    return merge_data;
}

/**
 * Attempts to load the package.json file at the given path. Resolves with json object or an empty object if errors occurred.
 * @param path
 * @returns {*}
 */
function load_package_file(path) {
    return new RSVP.Promise((resolve/**, reject **/) => {
        load_json(path)
            .then(resolve)
            .catch((err) => {
                resolve({});
            });
    });
}

/**
 * Attempts to load the pacmod configuration file at the given path. Resolves with config options or an empty object if errors occurred.
 * @param path
 * @returns {*}
 */
function load_pacmod_config(path) {
    return new RSVP.Promise((resolve/**, reject **/) => {
        load_json(path)
            .then(normalize_pacmod_config_data)
            .then(resolve)
            .catch((err) => {
                let warn_obj;

                // TODO: Better error detection/handling
                if (err.code === 'ENOENT') {
                    warn_obj = "No config file found in current directory. Using pacmod default settings...";
                } else {
                    warn_obj = (e && e.stack) || e;
                }

                console.log("WARNING: ", warn_obj);

                resolve({});
            });
    });
}

/**
 * Converts the given object keys to upper case
 * @param raw_data
 */
function normalize_pacmod_config_data(raw_data) {
    let config_data = _.mapKeys(raw_data, (value, key)=> {
        return key.toUpperCase();
    });

    config_data = _.mapValues(raw_data, (value, key) => {
        if (_.contains(folder_config_keys, key)) {
            if (!is_path_char(value.charAt(0))) {
                value = '/' + value;
            }
        }

        return value;
    });

    return config_data;
}

/**
 * Loads JSON in a given path
 * @param path
 * @returns {*|Promise.<T>|Promise}
 */
function load_json(path) {
    return read_file(path)
        .then((data) => {
            return JSON.parse(data);
        });
}

/**
 * Reads the file contents at a given path
 * @param path
 * @returns {*}
 */
function read_file(path) {
    return new RSVP.Promise((resolve/** , reject **/) => {
        /**
         * We're using a sync function here since gulp doesn't have a mechanism for async functions. Can change to async
         * When gulp adds wait support or when moving to our own task runner
         */
        var data = fs.readFileSync(path, 'utf8');
        resolve(data);
    });
}

/**
 * Determines whether the given character is valid at the beginning of a relative path
 * @param char
 * @returns {boolean}
 */
function is_path_char(char) {
    let path_chars = ['.', '/'];
    return _.contains(path_chars, char);
}
