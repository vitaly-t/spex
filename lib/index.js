'use strict';

// General: sequence + page are index-based, so they pass index into both source and destination;
//  - sequence rejects with {index, error, [data]}, while page rejects with {index, data}, data
// comes from the `batch`;
// while page + stream are autonomous, no index passed;
// chain passes only the data resolved;

// Conflict: Stream vs Sequence:
// Stream: autonomous source and dest, no tracking, no index;
// Sequence: index-based source and dest, tracking, index provided;
// Chain: data-based source, (tracking?) (index?)

// Why not replace it with just Stream:
// always provide index + previous data + optional tracking

// Names: stream implies destination;
// `chain` implies connection;
// `sequence` implies nothing;

/**
 * Specialized Promise Extensions
 * @module spex
 * @author Vitaly Tomilov
 * @param {Object|Function} promiseLib
 * @param {Object} options
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

function parsePromiseLib(lib) {
    if (lib) {
        var t = typeof lib;
        if (t === 'function' || t === 'object') {
            var root = lib.Promise instanceof Function ? lib.Promise : lib,
                methods = ['resolve', 'reject', 'all'], // key promise methods;
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
