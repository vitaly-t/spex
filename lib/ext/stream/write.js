'use strict';

/**
 * @method write
 */
function write(source, stream) {
    throw new Error("Method not implemented.");
}

var $utils, $p;

module.exports = function (config) {
    $utils = config.utils;
    $p = config.promise;
    return write;
};
