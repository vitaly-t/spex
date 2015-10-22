'use strict';

var stream = require('stream');

/////////////////////////////////////
// Simpler check for null/undefined;
function isNull(value) {
    return value === null || value === undefined;
}

/////////////////////////////////////
// Checks if the value is a promise;
function isPromise(value) {
    return value && value.then instanceof Function;
}

////////////////////////////////////////////
// Checks object for being a readable stream;

function isReadableStream(obj) {
    return obj instanceof stream.Stream &&
        typeof obj._read === 'function' &&
        typeof obj._readableState === 'object';
}

///////////////////////////////////////////
// Checks object for containing any of the
// specified properties;
function hasProperties(obj, params) {
    if (obj && obj instanceof Object) {
        for (var i = 0; i < params.length; i++) {
            if (params[i] in obj) {
                return true;
            }
        }
    }
    return false;
}

////////////////////////////////////////////////////////////
// Sets an object property as read-only and non-enumerable.
function extend(obj, name, value) {
    Object.defineProperty(obj, name, {
        value: value,
        enumerable: false,
        writable: false
    });
}

/////////////////////////////////////////////////////
// Resolves a mixed value into the actual value,
// consistent with the way mixed values are defined:
// https://github.com/vitaly-t/spex/wiki/Mixed-Values
function resolve(value, params, onSuccess, onError) {

    var self = this,
        delayed = false;

    function loop() {
        while (value instanceof Function) {
            try {
                value = params ? value.apply(self, params) : value.call(self);
            } catch (e) {
                onError(e);
                return;
            }
        }
        if (isPromise(value)) {
            value
                .then(function (data) {
                    delayed = true;
                    value = data;
                    loop();
                }, function (reason) {
                    onError(reason);
                });
        } else {
            onSuccess(value, delayed);
        }
    }

    loop();
}

module.exports = function (/*config*/) {
    return {
        isNull: isNull,
        isPromise: isPromise,
        isReadableStream: isReadableStream,
        hasProperties: hasProperties,
        extend: extend,
        resolve: resolve
    };
};
