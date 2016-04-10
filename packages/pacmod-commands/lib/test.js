var callLegacyCommand = require('./call_legacy_command.js');
var CommandHandler = require('./index.js').CommandHandler;

var TestHandler = new CommandHandler();

TestHandler.name = 'test';
TestHandler.description = "Runs pacmod in test mode";

TestHandler.callback = function __testCommandCallback(pacfile, args) {
  return callLegacyCommand(['test'].concat(args.flags || []), pacfile);
};
