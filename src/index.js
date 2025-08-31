/**
 * @module spex
 * @summary Specialized Promise Extensions
 * @author Vitaly Tomilov
 *
 * @description
 * ## Specialized Promise Extensions
 *
 * @returns {Object}
 * Namespace with all supported methods.
 *
 * @see {@link batch}, {@link page}, {@link sequence}, {@link stream}
 */
module.exports = {
    batch: require('./ext/batch').batch,
    page: require('./ext/page').page,
    sequence: require('./ext/sequence').sequence,
    stream: require('./ext/stream'),
    errors: require('./errors')
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
