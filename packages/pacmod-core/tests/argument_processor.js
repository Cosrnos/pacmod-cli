const assert = require('assert');

const ArgumentProcessor = require('../lib/argument_processor.js');

describe('pacmod-core/argument_processor', function () {
    describe('splitArguments', function () {
        it('should split arguments on spaces', function () {
            assert.deepEqual(ArgumentProcessor.splitArguments('init foo bar'), ['init', 'foo', 'bar']);
        });

        it('should split arguments on tabs', function () {
            assert.deepEqual(ArgumentProcessor.splitArguments('init\tfoo'), ['init', 'foo']);
        });

        it('should preserve assignments', function () {
            assert.deepEqual(ArgumentProcessor.splitArguments('init foo=bar'), ['init', 'foo=bar']);
        });
    });
});
