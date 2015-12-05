'use strict';

try {
    eval("(function *(){})");
} catch (e) {
    return; // ES6 not supported, exit.
}

require('./es6/generators');
