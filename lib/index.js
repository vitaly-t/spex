'use strict';

var utils = require('./utils');

/*
 Summary for the methods:

 page: take page-by-page, and just resolve them till no data left;
 channel: the combination of stream+page - pumping pages from source, resolving and passing into the destination;
 cascade - like sequence, except in order to get the next promise, resolve data is required
 from the previous resolve, i.e. sequence is independent, while cascade is strictly dependent;
 (this could be called "chain")
 */

/*
 List of methods presented in this library:

 1. Resolve an independent sequence of promises (sequence);
 2. Resolve a dependent sequence of promises (cascade or link or chain);
 3. Stream promises one-by-one from source to destination (stream);
 4. Resolve pages of promises (page);
 5. Resolve an existing array of promises (batch);

link: when a promise can only be initiated with the result from the previous promise;

 * */

// TODO: Provide standard stat for all operations, once they resolve:
// {duration, total, data}

/**
 * Specialized Promise Extensions
 * @module spe
 * @author Vitaly Tomilov
 * @param {Object|Function} promiseLib
 * @param {Object} options
 */
function main(promiseLib, options) {

    var spex = {}, // library instance;
        promise = parsePromiseLib(promiseLib), // promise library parsing;
        methods = ['batch', 'channel', 'link', 'page', 'sequence', 'stream', 'throttle']; // methods supported;

    var config = {
        spex: spex,
        promise: promise,
        options: options
    };

    methods.forEach(function (m) {
        var value = require('./ext/' + m)(config);
        utils.property(spex, m, value);
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
