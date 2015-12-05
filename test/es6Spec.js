'use strict';

try {
    eval("(function *(){})");
} catch (e) {
    return; // ES6 not supported, exit.
}

require('./es6/generators');
require('./es6/batch');
require('./es6/sequence');
require('./es6/page');
