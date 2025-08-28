const npm = {
    utils: require('./utils'),
    batch: require('./ext/batch'),
    page: require('./ext/page'),
    sequence: require('./ext/sequence'),
    stream: require('./ext/stream'),
    errors: require('./errors')
};

/**
 * @module spex
 * @summary Specialized Promise Extensions
 * @author Vitaly Tomilov
 *
 * @description
 * Extends ES6 Promises with additional methods.
 *
 * @param {Object|Function} promiseLib
 * Instance of a promise library to be used by this module.
 *
 * Some implementations use `Promise` constructor to create a new promise, while
 * others use the module's function for it. Both types are supported the same.
 *
 * Alternatively, an object of type {@link PromiseAdapter} can be passed in, which provides
 * compatibility with any promise library outside of the standard.
 *
 * Passing in a promise library that cannot be recognized will throw
 * `Invalid promise library specified.`
 *
 * @returns {Object}
 * Namespace with all supported methods.
 *
 * @see {@link PromiseAdapter}, {@link batch}, {@link page}, {@link sequence}, {@link stream}
 */

module.exports = {
    errors: npm.errors,
    batch: npm.batch,
    page: npm.page,
    sequence: npm.sequence,
    stream: npm.stream
};

/**
 * @external Error
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
 */

/**
 * @external TypeError
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError
 */

/**
 * @external Promise
 * @see https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise
 */
