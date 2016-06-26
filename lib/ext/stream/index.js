'use strict';

var $npm = {
    read: require('./read')
};

/**
 * @namespace stream
 * @description
 * Stream namespace.
 *
 * @property {function} stream.read
 *
 */
module.exports = function (config) {
    var res = {
        read: $npm.read(config)
    };
    Object.freeze(res);
    return res;
};

