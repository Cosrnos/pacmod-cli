"use strict";

var CommandHandler = require('./index.js').CommandHandler;
var callLegacyCommand = require('./call_legacy_command.js');

var DefaultHandler = new CommandHandler();

DefaultHandler.name = 'default';
DefaultHandler.description = "Builds the environment with default options";

DefaultHandler.callback = function (pacfile, args) {
    callLegacyCommand(['default'].concat(args.flags || []), pacfile);
}
