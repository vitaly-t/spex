'use strict';

var $npm = {
    BatchError: require('./batch'),
    PageError: require('./page'),
    SequenceError: require('./sequence')
};

/**
 * @namespace errors
 * @description
 * Namespace for all custom error types supported by the library.
 *
 * @property {function} BatchError
 * {@link errors.BatchError BatchError} interface.
 *
 * Represents all errors that can be reported by method {@link batch}.
 *
 * @property {function} PageError
 * {@link errors.PageError PageError} interface.
 *
 * Represents all errors that can be reported by method {@link page}.
 *
 * @property {function} SequenceError
 * {@link errors.SequenceError SequenceError} interface.
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
