'use strict';

var $utils, $p;

// It must involve timeouts between data requests and responses, possibly a configurator;

/**
 * @method throttle
 * @summary Not yet formulated.
 * @param values
 */
function throttle(values) {
}

// TODO: Check the posts I did for Bluebird: https://github.com/petkaantonov/bluebird/issues/570
// Throttling strategies: page, cascade, channel
// Check also: https://github.com/petkaantonov/bluebird/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aclosed+throttle

module.exports = function (config) {
    $utils = config.utils;
    $p = config.promise;
    return throttle;
};
