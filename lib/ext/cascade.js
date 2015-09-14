'use strict';

var utils = require('../utils');
var $p; // promise wrapper;

// That's cascading promises: resolving them in a chain,
// while passing the result from the one to the next one, along with the context;

/**
 * @method cascade
 * @param route
 * @param context
 */
function cascade(route, context){
    // route - array of functions, each takes context and returns a promise,
    // except for the last one;

    // loop through the array: resolve the first one, pass data into the second one,
    // and so on;
}

module.exports = function (promise) {
    $p = promise;
    return cascade;
};
