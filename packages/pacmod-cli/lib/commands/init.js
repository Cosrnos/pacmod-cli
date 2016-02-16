var callLegacyCommand = require('./call_legacy_command.js');
var CommandHandler = require('./index.js').CommandHandler;

var InitHandler = new CommandHandler();

InitHandler.name = 'init';
InitHandler.description = "Initializes a new pacmod project in the current directory";

InitHandler.callback = function __initCommandCallback(pacfile, args) {
    return callLegacyCommand(['init'].concat(args.flags || []), pacfile);
};
