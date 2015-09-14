'use strict';

/*
 Summary for the methods:

 stream: one-by-one, from source and into the destination;
 page: take page-by-page, and just resolve them till no data left;
 channel: the combination of stream+page - pumping pages from source, resolving and passing into the destination;
 throttle: must involve timeouts between data requests and responses, possibly a configurator;

 */

/**
 * Specialized Promise Extensions
 * @module spe
 * @author Vitaly Tomilov
 * @param {Object|Function} promiseLib
 */
function main(promiseLib) {

    var inst = {}, // library instance;
        promise = parsePromiseLib(promiseLib), // promise library parsing;
        methods = ['batch', 'cascade', 'channel', 'page', 'sequence', 'stream', 'throttle']; // methods supported;

    for (var i = 0; i < methods.length; i++) {
        addMethod(inst, methods[i], promise);
    }

    return inst;
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
            for (var i = 0; i < methods.length; i++) {
                var m = methods[i];
                promise[m] = root[m];
                success = success && root[m] instanceof Function;
            }
            if (success) {
                return promise;
            }
        }
    }
    throw new Error("Invalid promise library specified.");
}

function addMethod(obj, name, promise) {
    Object.defineProperty(obj, name, {
        value: require('./ext/' + name)(promise),
        enumerable: true,
        writable: false
    });
}

module.exports = main;
