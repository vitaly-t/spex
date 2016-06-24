'use strict';

var $npm = {
    os: require('os'),
    utils: require('../utils/static')
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
 * @property {} source
 *
 * @property {} dest
 *
 * @property {} data
 *
 */
function PageError(e) {

    var temp = Error.apply(this, arguments);
    temp.name = this.name = 'PageError';

    this.index = e.index;

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
            gap1 + 'message: "' + this.message + '"'
        ];
    lines.push(gap0 + '}');
    return lines.join($npm.os.EOL);
};

PageError.prototype.inspect = function () {
    return this.toString();
};

module.exports = PageError;
