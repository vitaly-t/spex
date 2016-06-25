'use strict';

var $npm = {
    u: require('util'),
    os: require('os'),
    utils: require('../utils/static')
};

var errorReasons = {
    0: "Page with index %d failed to resolve.",
    1: "Source %s returned a rejection at index %d.",
    2: "Source %s threw an error at index %d.",
    3: "Destination %s returned a rejection at index %d.",
    4: "Destination %s threw an error at index %d.",
    5: "Source %s returned a non-array value at index %d."
};

/**
 * @interface errors.PageError
 * @augments external:Error
 * @description
 * This type represents any error rejected by method {@link page}.
 *
 * @property {string} name
 * Standard {@link external:Error Error} property - error type name = `PageError`.
 *
 * @property {string} message
 * Standard {@link external:Error Error} property - the error message.
 *
 * @property {object} stack
 * Standard {@link external:Error Error} property - the stack trace.
 *
 * @property {number} index
 *
 * @property {} error
 *
 * @property {} source
 *
 * @property {} dest
 *
 * @property {} data
 *
 * @property {string} reason
 *
 */
function PageError(e, code, cbName, duration) {

    var temp = Error.apply(this, arguments);
    temp.name = this.name = 'PageError';

    this.index = e.index;
    this.duration = duration;

    // TODO: Consider renaming, because `data` here is a BatchError object.

    if ('data' in e) {
        this.data = e.data;
        this.error = e.data.first;
    } else {
        this.error = e.error;
    }

    if (this.error instanceof Error) {
        this.message = this.error.message;
    } else {
        this.message = this.error;
    }

    if ('source' in e) {
        this.source = e.source;
    }

    if ('dest' in e) {
        this.dest = e.dest;
    }

    if (code) {
        cbName = cbName ? ("'" + cbName + "'") : '<anonymous>';
        this.reason = $npm.u.format(errorReasons[code], cbName, e.index);
    } else {
        this.reason = $npm.u.format(errorReasons[code], e.index);
    }
}

PageError.prototype = Object.create(Error.prototype, {
    constructor: {
        value: PageError,
        writable: true,
        configurable: true
    }
});

/**
 * @method errors.PageError.toString
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
PageError.prototype.toString = function (level) {

    level = level > 0 ? parseInt(level) : 0;

    var gap0 = $npm.utils.messageGap(level),
        gap1 = $npm.utils.messageGap(level + 1),
        lines = [
            'PageError {',
            gap1 + 'message: ' + JSON.stringify(this.message),
            gap1 + 'reason: ' + this.reason,
            gap1 + 'index: ' + this.index,
            gap1 + 'duration: ' + this.duration
        ];

    // TODO: Reconsider adding `source`/`dest` here, because these are whole page of data!

    if ('source' in this) {
        lines.push(gap1 + 'source: ' + $npm.u.inspect(this.source));
    }

    if ('dest' in this) {
        lines.push(gap1 + 'dest: ' + $npm.u.inspect(this.dest));
    }

    lines.push(gap1 + 'error: ' + $npm.u.inspect(this.error));
    lines.push(gap0 + '}');

    return lines.join($npm.os.EOL);
};

PageError.prototype.inspect = function () {
    return this.toString();
};

module.exports = PageError;
