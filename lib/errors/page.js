'use strict';

var $npm = {
    os: require('os'),
    utils: require('../utils/static')
};

/**
 * @class errors.PageError
 * @augments Error
 * @description
 * Bla-bla.
 *
 * @returns {errors.PageError}
 */
function PageError(msg) {
    var temp = Error.apply(this, arguments);
    temp.name = this.name = 'PageError';
    this.message = msg;
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
