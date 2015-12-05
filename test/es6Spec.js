'use strict';

try {
    eval("(function *(){})");
} catch (e) {
    return; // ES6 not supported, exit.
}

require('./generators');
require('./ext/batch/es6');
require('./ext/page/es6');
require('./ext/sequence/es6');
require('./ext/stream/es6');

