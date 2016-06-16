'use strict';

var $npm = {
    os: require('os'),
    utils: require('../utils/static')
};

/**
 * @class errors.SequenceError
 * @augments Error
 * @description
 * Bla-bla.
 *
 * @returns {errors.SequenceError}
 */
function SequenceError(e) {
    var temp = Error.apply(this, arguments);
    temp.name = this.name = 'SequenceError';
    this.error = e.error;
    this.message = e.error.message || e.error;
    this.index = e.index;
    if ('source' in e) {
        this.source = e.source;
    }
    if ('dest' in e) {
        this.dest = e.dest;
    }
}

SequenceError.prototype = Object.create(Error.prototype, {
    constructor: {
        value: SequenceError,
        writable: true,
        configurable: true
    }
});

/**
 * @method errors.SequenceError.toString
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
SequenceError.prototype.toString = function (level) {
    level = level > 0 ? parseInt(level) : 0;
    var gap0 = $npm.utils.messageGap(level),
        gap1 = $npm.utils.messageGap(level + 1),
        lines = [
            'SequenceError {',
            gap1 + 'message: "' + this.message + '"'
        ];
    lines.push(gap0 + '}');
    return lines.join($npm.os.EOL);
};

SequenceError.prototype.inspect = function () {
    return this.toString();
};

module.exports = SequenceError;
