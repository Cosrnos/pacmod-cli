var _ = require('lodash');

var ArgumentDictionary = require('./argument_dictionary.js');
var CLIDictionary = new ArgumentDictionary();

module.exports = CLIDictionary;

var Package = require('./index.js');
var Commands = Package.import('pacmod-commands');

// Commands
_.each(Commands.getAllHandlers(), function (handler) {
    CLIDictionary.define(handler.name, 'command', handler.description);

    _.each(handler.options, function (option) {
        var desc = "";

        if (option.required) {
            desc += "(Required) ";
        }

        desc += option.description;

        CLIDictionary.define(option.key, 'option', desc);
    });

    _.each(handler.flags, function (flag) {
        CLIDictionary.define(flag.key, 'flag', flag.description);
    });

});

// Flags
CLIDictionary.define('-d', 'flag', 'Enables debug logs');
