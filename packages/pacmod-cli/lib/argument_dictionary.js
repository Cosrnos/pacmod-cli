"use strict";
const assert = require('assert');

function ArgumentDictionary() {
    this.values = {
        command: {},
        flag: {},
        option: {}
    };
}

module.exports = ArgumentDictionary;

// Public API
ArgumentDictionary.prototype.lookup = function (arg, type) {
    var data;

    if (type) {
        data = lookup_by_type(this.values, arg, type);
    } else {
        data = typeless_lookup(this.values, arg);
    }

    return data || null;
};

ArgumentDictionary.prototype.define = function (arg, type, info) {
    var location = this.lookup(arg, type);
    if (location) {
        return location.push(info);
    }

    this.values[type][arg] = [info];
};

// Private API
function typeless_lookup(dictionary, arg) {
    var found_arg = null;
    var types = Object.getOwnPropertyNames(dictionary);

    for (let i = 0; (i < types && !found_arg); i++) {
        let type = types[i];
        if (dictionary[type][arg]) {
            found_arg = value[arg];
        }
    }

    return found_arg;
}

function lookup_by_type(dictionary, arg, type) {
    return dictionary[type][arg] || null;
}
