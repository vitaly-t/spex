'use strict';

var stream = require('stream');

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

////////////////////////////////////////////////////////////
// Sets an object property as read-only and non-enumerable.
function extend(obj, name, value) {
    Object.defineProperty(obj, name, {
        value: value,
        configurable: false,
        enumerable: false,
        writable: false
    });
}

///////////////////////////////////////////
// Returns a space gap for console output;
function messageGap(level) {
    return Array(1 + level * 4).join(' ');
}

module.exports = {
    isPromise: isPromise,
    isReadableStream: isReadableStream,
    messageGap: messageGap,
    extend: extend
};
