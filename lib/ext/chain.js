'use strict';

var $utils, $p;

/**
 * @method chain
 * @summary Resolves a linked sequence of dynamic promises.
 * @param source
 */
function chain(source) {
    // source function returns a promise based on the data resolved from the previous call,
    // except for the very first promise.

    // resolves with the very first non-promise value returned by the source?
    // Or perhaps on null/undefined, like sequence?
    // TODO: It must be aligned with the sequence logic!

    // rejects, if the source throws an error;
}

module.exports = function (config) {
    $utils = config.utils;
    $p = config.promise;
    return chain;
};
