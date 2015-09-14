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

module.exports = {
    isNull: isNull,
    isPromise: isPromise
};
