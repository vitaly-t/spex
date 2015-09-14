'use strict';

/////////////////////////////////////
// Simpler check for null/undefined;
function isNull(value) {
    return value === null || value === undefined;
}

///////////////////////////////////////////
// Check if the value is a promise object;
function isPromise(value) {
    return value && value.then instanceof Function;
}

////////////////////////////////////////
// Extends an object with an enumerable
// read-only method or property.
function extend(obj, name, value) {
    Object.defineProperty(obj, name, {
        value: value,
        enumerable: true,
        writable: false
    });
}

module.exports = {
    isNull: isNull,
    isPromise: isPromise,
    extend: extend
};
