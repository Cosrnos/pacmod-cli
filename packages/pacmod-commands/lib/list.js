var _ = require('lodash');

var CommandDefs = require('./index.js');
var CommandHandler = CommandDefs.CommandHandler;

var ListHandler = new CommandHandler();

ListHandler.name = 'list';
ListHandler.description = "Lists all available commands";

ListHandler.callback = function __defaultCommandCallback(/** pacfile, args **/) {
    console.log("Pacmod Commands:");
    _.each(CommandDefs.getAllHandlers(), function (handler) {
        console.log(handler.name + '\t\t- ' + handler.description);
    });
    console.log('----------------------------------------');
};
