var Assert = require('assert');
var ArgumentProcessor = require('./argument_processor.js');
var Commands = require('./commands/index.js');
var _ = require('lodash');
var RSVP = require('rsvp');

function execute(pacfile, cli_args) {
    try {
        var paramGroups = ArgumentProcessor.parseArguments(cli_args),
            command,
            commandHandler;
        if (!paramGroups.commands.length) {
            paramGroups.commands.push('default');
        }

        Assert(paramGroups.commands.length === 1, 'May not pass more than one command at a time');

        command = paramGroups.commands.pop();
        commandHandler = Commands.lookup(command);
        Assert(commandHandler, "Unable to find handler for given command `" + command + "`");
        assertRequiredOptions(commandHandler, paramGroups);

        return wrapCallbackInPromise(commandHandler.callback(pacfile, paramGroups));
    } catch (ex) {
        console.log(ex && ex.stack || ex);
    }
};

function assertRequiredOptions(commandHandler, paramGroups) {
    var requiredOptions,
        excludedOptions;

    requiredOptions = _.filter(commandHandler.options, function (option) {
        return option.required;
    });

    excludedOptions = _excludedOptions(requiredOptions, paramGroups.options);

    if (!excludedOptions.length) {
        return;
    }

    throw new Error('Missing required option(s) for `' + commandHandler.name + '`. ("' + excludedOptions.join('","') + '")');
}

function _excludedOptions(required, given) {
    var givenKeys = _.map(given, function (arg) {
        return arg.key;
    });
    var requiredKeys = _.map(required, function (arg) {
        return arg.key;
    });

    return _.difference(requiredKeys, givenKeys);
}

function wrapCallbackInPromise(callback) {
    return new RSVP.Promise(function (resolve, reject) {
        if (callback && callback.then) {
            return callback.then(resolve).catch(reject);
        }

        return resolve(callback);
    });
}

module.exports = {
    execute: execute
};
