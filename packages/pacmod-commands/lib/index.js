var handlers = [];
var _ = require('lodash');
var includeList = [
    'default',
    'init',
    'test',
    'list'
];

function CommandHandler() {
    this.name = "";
    this.description = "";
    this.callback = _unimplimentedCommand.bind(this);
    this.options = [];
    this.flags = [];
    this.addOption = function (argument, description, required) {
        this.options.push({
            key: argument,
            description: description,
            required: required || false
        });
    };
    this.addFlag = function (option, description) {
        this.flags.push({
            key: option,
            description: description
        });
    };

    handlers.push(this);
}

function lookup(command) {
    return _.find(handlers, function (cmd) {
        return cmd.name === command;
    });
}

function _unimplimentedCommand() {
    throw new Error("Unable to process command `" + this.name + "` as no handler has been defined");
}

function getAllHandlers() {
    return handlers.concat([]);
}

module.exports = {
    CommandHandler: CommandHandler,
    lookup: lookup,
    getAllHandlers: getAllHandlers
};

// Include all commands
_.each(includeList, function (name) {
    require('./' + name + '.js');
});
