'use strict';

var utils = require('../utils');
var $p; // promise wrapper;

/**
 * @method throttle
 * @param values
 */
function throttle(values) {
    // TODO: Check the posts I did for Bluebird: https://github.com/petkaantonov/bluebird/issues/570
    //
}

// Throttling strategies: page, cascade, channel
// Check also: https://github.com/petkaantonov/bluebird/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aclosed+throttle

module.exports = function (promise) {
    $p = promise;
    return throttle;
};
