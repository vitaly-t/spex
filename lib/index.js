'use strict';

/**
 * @module spex
 * @summary Specialized Promise Extensions
 * @author Vitaly Tomilov
 *
 * @description
 * Attaches to an external promise library and provides additional methods built solely
 * on the basic promise operations:
 *  - construct a new promise with a callback function
 *  - resolve a promise with some result data
 *  - reject a promise with a reason
 *
 * ### usage
 * For any third-party promise library:
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
 * Some implementations use `Promise` constructor to create a new promise, while
 * others use the module's function for it. Both types are supported the same.
 *
 * Alternatively, an object of type {@link PromiseAdapter} can be passed in, which
 * provides compatibility with all non-standard promise libraries.
 *
 * Passing in a promise library that cannot be recognized will throw
 * `Invalid promise library specified.`
 *
 * @returns {Object}
 * Namespace with all supported methods.
 *
 * @see $[batch], $[page], $[sequence], $[stream]
 */
function main(promiseLib) {

    var spex = {}, // library instance;
        promise = parsePromiseLib(promiseLib); // promise library parsing;

    var config = {
        spex: spex,
        promise: promise
    };

    config.utils = require('./utils')(config);

    spex.batch = require('./ext/batch')(config);
    spex.page = require('./ext/page')(config);
    spex.sequence = require('./ext/sequence')(config);

    spex.stream = {};
    spex.stream.read = require('./ext/stream/read')(config);

    config.utils.extend(spex, '$p', promise);

    Object.freeze(spex.stream);
    Object.freeze(spex);

    return spex;
}

//////////////////////////////////////////
// Parses and validates a promise library;
function parsePromiseLib(lib) {
    if (lib) {
        var promise;
        if (lib instanceof PromiseAdapter) {
            promise = function (func) {
                return lib.create(func);
            };
            promise.resolve = lib.resolve;
            promise.reject = lib.reject;
            return promise;
        }
        var t = typeof lib;
        if (t === 'function' || t === 'object') {
            var root = lib.Promise instanceof Function ? lib.Promise : lib;
            promise = function (func) {
                return new root(func);
            };
            promise.resolve = root.resolve;
            promise.reject = root.reject;
            if (promise.resolve instanceof Function && promise.reject instanceof Function) {
                return promise;
            }
        }
    }
    throw new TypeError("Invalid promise library specified.");
}

/**
 * @constructor PromiseAdapter
 * @summary Adapter for the primary promise operations.
 * @description
 * Provides compatibility with promise libraries that are not $[Promises/A+] compliant,
 * via functions that implement the primary operations with promises:
 *
 *  - construct a new promise with a callback function
 *  - resolve a promise with some result data
 *  - reject a promise with a reason
 *
 * @param {Function} create
 * A function that takes a callback parameter and returns a new promise object.
 *
 * @param {Function} resolve
 * A function that takes an optional data and resolves a promise with it.
 *
 * @param {Function} reject
 * A function that takes an optional error and rejects a promise with it.
 */
function PromiseAdapter(create, resolve, reject) {

    this.create = create;
    this.resolve = resolve;
    this.reject = reject;

    if (typeof create !== 'function') {
        throw new TypeError('Adapter requires a function to create a promise.');
    }

    if (typeof resolve !== 'function') {
        throw new TypeError('Adapter requires a function to resolve a promise.');
    }

    if (typeof reject !== 'function') {
        throw new TypeError('Adapter requires a function to reject a promise.');
    }
}

main.PromiseAdapter = PromiseAdapter;
Object.freeze(main);

module.exports = main;
