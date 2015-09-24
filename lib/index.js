'use strict';

/**
 * @module spex
 * @summary Specialized Promise Extensions
 * @author Vitaly Tomilov
 *
 * @description
 * Attaches to an external promise library to provide additional methods built solely
 * on the basic promise operations:
 *  - construct a new promise with a callback function
 *  - resolve a promise with result data
 *  - reject a promise with a reason
 *
 * ## usage
 * For third-party promise libraries:
 * ```js
 * var promise = require('bluebird');
 * var spex = require('spex')(promise);
 * ```
 * For ES6 promises:
 * ```js
 * var spex = require('spex')(Promise);
 * ```
 *
 * @param {Object|Function} promiseLib
 * Instance of a promise library to be used by this module.
 *
 * Some implementations expose the standard `Promise` constructor - $[Bluebird], $[When], $[Q],
 * while others use the module's main function for the same, like $[Promise] and $[Lie]. Both types
 * are supported and initialized in the same way.
 *
 * If the parameter isn't recognized as a promise library, the method will throw
 * `Invalid promise library specified.`
 *
 * @param {Object} [options]
 * Optional configuration object with properties - options.
 *
 * Not used in the current version of the library.
 *
 * @returns {Object}
 * Namespace with all supported methods.
 *
 * @see $[batch], $[page], $[sequence]
 */
function main(promiseLib, options) {

    var spex = {}, // library instance;
        promise = parsePromiseLib(promiseLib), // promise library parsing;
        methods = ['batch', 'page', 'sequence']; // methods supported;

    var config = {
        spex: spex,
        promise: promise,
        options: options
    };

    config.utils = require('./utils')(config);

    methods.forEach(function (m) {
        var value = require('./ext/' + m)(config);
        config.utils.property(spex, m, value);
    });

    return spex;
}

/////////////////////////////////////////
// Parses and validate a promise library;
function parsePromiseLib(lib) {
    if (lib) {
        var t = typeof lib;
        if (t === 'function' || t === 'object') {
            var root = lib.Promise instanceof Function ? lib.Promise : lib,
                methods = ['resolve', 'reject'], // key promise methods;
                success = true;
            var promise = function (func) {
                return new root(func);
            };
            methods.forEach(function (m) {
                promise[m] = root[m];
                success = success && root[m] instanceof Function;
            });
            if (success) {
                return promise;
            }
        }
    }
    throw new Error("Invalid promise library specified.");
}

module.exports = main;
