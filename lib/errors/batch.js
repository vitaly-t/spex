'use strict';

var $npm = {
    u: require('util'),
    os: require('os'),
    utils: require('../utils/static')
};

/**
 * @interface errors.BatchError
 * @augments external:Error
 * @description
 * This type represents any error rejected by method {@link batch}.
 *
 * @property {string} name
 * Standard {@link external:Error Error} property - error type name = `BatchError`.
 *
 * @property {string} message
 * Standard {@link external:Error Error} property - the error message.
 *
 * @property {object} stack
 * Standard {@link external:Error Error} property - the stack trace.
 *
 * @property {} data
 *
 * @property {} stat
 *
 * @property {number} stat.total
 * @property {number} stat.succeeded
 * @property {number} stat.failed
 * @property {number} stat.duration
 *
 * @property {error} first
 *
 */
function BatchError(result, errors, duration) {

    var temp = Error.apply(this, arguments);
    temp.name = this.name = 'BatchError';

    this.data = result;

    this.getErrors = function () {
        var err = new Array(errors.length);
        for (var i = 0; i < errors.length; i++) {
            err[i] = result[errors[i]].result;
            if (err[i] instanceof BatchError) {
                err[i] = err[i].getErrors();
            }
        }
        $npm.utils.extend(err, '$isErrorList', true);
        return err;
    };
    
    var e = this.getErrors(),
        first = e[0];
    
    while (first && first.$isErrorList) {
        first = first[0];
    }
    
    // we do not show it within the inspect, because when the error
    // happens for a nested result, the output becomes a mess.
    this.first = first;

    if (first instanceof Error) {
        this.message = first.message;
    } else {
        this.message = first;
    }

    this.stat = {
        total: result.length,
        succeeded: result.length - e.length,
        failed: e.length,
        duration: duration
    };

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
        gap2 = $npm.utils.messageGap(level + 2),
        gap3 = $npm.utils.messageGap(level + 3),
        lines = [
            'BatchError {',
            gap1 + 'message: ' + JSON.stringify(this.message),
            gap1 + 'stat: { total: ' + this.stat.total + ', succeeded: ' + this.stat.succeeded +
            ', failed: ' + this.stat.failed + ', duration: ' + this.stat.duration + ' }',
            gap1 + 'data: ['
        ];

    this.data.forEach(function (d, index, data) {
        lines.push(gap2 + index + ': {');
        lines.push(gap3 + 'success: ' + d.success);
        lines.push(gap3 + 'result: ' + $npm.utils.formatError(d.result, level + 3));
        if (d.origin) {
            lines.push(gap3 + 'origin: ' + $npm.u.inspect(d.origin));
        }
        var sep = (index < data.length - 1) ? ',' : '';
        lines.push(gap2 + '}' + sep);
    });
    lines.push(gap1 + ']');

    lines.push(gap0 + '}');
    return lines.join($npm.os.EOL);
};

BatchError.prototype.inspect = function () {
    return this.toString();
};

module.exports = BatchError;