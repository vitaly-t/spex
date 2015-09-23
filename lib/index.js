'use strict';

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
/*
main.PromiseAdapter = function (create, resolve, reject) {
    this.create = create;
    this.resolve = resolve;
    this.reject = reject;
};

// Example of Angular JS $q adapter;
var adapter = new PromiseAdapter(function (cb) {
    return $q(cb);
}, function (data) {
    return $q.when(data);
}, function (reason) {
    return $q.reject(reason);
});
*/

module.exports = main;
