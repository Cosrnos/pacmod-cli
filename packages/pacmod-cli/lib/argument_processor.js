const _ = require('lodash');

var ArgumentProcessor = {};
var CLIDictionary = require('./cli_dictionary.js');

module.exports = ArgumentProcessor;

ArgumentProcessor.parseArguments = (args) => {
    var split_arguments = ArgumentProcessor.splitArguments(args);

    return {
        commands: ArgumentProcessor.parseCommands(split_arguments),
        flags: ArgumentProcessor.parseFlags(split_arguments),
        options: ArgumentProcessor.parseOptions(split_arguments)
    };
};

ArgumentProcessor.splitArguments = (args) => {
    return args.split(/\s/g);
};

ArgumentProcessor.parseCommands = (args) => {
    return ArgumentProcessor.filterArgs(args, 'command');
};

ArgumentProcessor.parseFlags = (args) => {
    return ArgumentProcessor.filterArgs(args, 'flag');
};

ArgumentProcessor.parseOptions = (args) => {
    var option_data = [];

    _.each(args, function (arg) {
        var option = arg.split('=');

        if (option.length > 1) {
            option_data.push({
                key: option[0],
                value: option[1]
            });
        }
    });

    return option_data;
};

ArgumentProcessor.filterArgs = (args, type) => {
    return _.filter(args, function (arg) {
        return CLIDictionary.lookup(arg, type);
    });
};
