'use strict';

var $npm = {
    u: require('util'),
    os: require('os'),
    utils: require('../utils/static')
};

var errorReasons = {
    0: "Source %s returned a rejection at index %d.",
    1: "Source %s threw an error at index %d.",
    2: "Destination %s returned a rejection at index %d.",
    3: "Destination %s threw an error at index %d."
};

/**
 * @interface errors.SequenceError
 * @augments external:Error
 * @description
 * This type represents any error rejected by method {@link sequence}.
 *
 * @property {string} name
 * Standard {@link external:Error Error} property - error type name = `SequenceError`.
 *
 * @property {string} message
 * Standard {@link external:Error Error} property - the error message.
 *
 * @property {object} stack
 * Standard {@link external:Error Error} property - the stack trace.
 *
 * @property {number} index
 *
 * @property {} source
 *
 * @property {} dest
 *
 * @property {} duration
 *
 * @property {string} reason
 *
 */
function SequenceError(e, code, cbName, duration) {

    var temp = Error.apply(this, arguments);
    temp.name = this.name = 'SequenceError';

    this.index = e.index;
    this.duration = duration;

    this.error = e.error;

    if (this.error instanceof Error) {
        this.message = this.error.message;
    } else {
        this.message = this.error;
    }

    if ('source' in e) {
        this.source = e.source;
    } else {
        this.dest = e.dest;
    }

    cbName = cbName ? ("'" + cbName + "'") : '<anonymous>';
    this.reason = $npm.u.format(errorReasons[code], cbName, e.index);
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
            gap1 + 'message: ' + JSON.stringify(this.message),
            gap1 + 'reason: ' + this.reason,
            gap1 + 'index: ' + this.index,
            gap1 + 'duration: ' + this.duration
        ];

    if ('source' in this) {
        lines.push(gap1 + 'source: ' + $npm.u.inspect(this.source));
    } else {
        lines.push(gap1 + 'dest: ' + $npm.u.inspect(this.dest));
    }

    lines.push(gap1 + 'error: ' + $npm.u.inspect(this.error));
    lines.push(gap0 + '}');

    return lines.join($npm.os.EOL);
};

SequenceError.prototype.inspect = function () {
    return this.toString();
};

module.exports = SequenceError;
