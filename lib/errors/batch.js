'use strict';

var $npm = {
    os: require('os'),
    utils: require('../utils/static')
};

/**
 * @class errors.BatchError
 * @augments Error
 * @description
 * Bla-bla.
 *
 * @returns {errors.BatchError}
 */
function BatchError(msg) {
    var temp = Error.apply(this, arguments);
    temp.name = this.name = 'BatchError';
    this.message = msg;
}

BatchError.prototype = Object.create(Error.prototype, {
    constructor: {
        value: BatchError,
        writable: true,
        configurable: true
    }
});

/**
 * @method errors.BatchError.toString
 * @description
 * Creates a well-formatted multi-line string that represents the error.
 *
 * It is called automatically when writing the object into the console.
 *
 * @param {number} [level=0]
 * Nested output level, to provide visual offset.
 *
 * @returns {string}
 */
BatchError.prototype.toString = function (level) {
    level = level > 0 ? parseInt(level) : 0;
    var gap0 = $npm.utils.messageGap(level),
        gap1 = $npm.utils.messageGap(level + 1),
        lines = [
            'BatchError {',
            gap1 + 'message: "' + this.message + '"'
        ];
    lines.push(gap0 + '}');
    return lines.join($npm.os.EOL);
};

BatchError.prototype.inspect = function () {
    return this.toString();
};

module.exports = BatchError;
