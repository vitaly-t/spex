'use strict';

var $npm = {
    BatchError: require('./batch'),
    PageError: require('./page'),
    SequenceError: require('./sequence')
};

/**
 * @namespace errors
 * @description
 * Error types namespace.
 *
 * @property {function} BatchError
 * {@link errors.BatchError BatchError} class constructor.
 *
 * Represents all errors that can be reported by method {@link batch}.
 *
 * @property {function} PageError
 * {@link errors.PageError PageError} class constructor.
 *
 * Represents all errors that can be reported by method {@link page}.
 *
 * @property {function} SequenceError
 * {@link errors.SequenceError SequenceError} class constructor.
 *
 * Represents all errors that can be reported by method {@link sequence}.
 *
 */
module.exports = {
    BatchError: $npm.BatchError,
    PageError: $npm.PageError,
    SequenceError: $npm.SequenceError
};

Object.freeze(module.exports);

/**
 * @external Error
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
 */
