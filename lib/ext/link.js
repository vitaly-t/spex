'use strict';

var utils = require('../utils');
var $p; // promise wrapper;

/**
 * @method link
 * @summary Sequentially resolves a chain of dependent dynamic promises.
 * @param source
 */
function link(source) {
    // source function returns a promise based on the data resolved from the previous call,
    // except for the very first promise.

    // resolves with the very first non-promise value returned by the source?
    // Or perhaps on null/undefined, like sequence?
    // TODO: It must be aligned with the sequence logic!

    // rejects, if the source throws an error;
}

module.exports = function (config) {
    $p = config.promise;
    return link;
};
