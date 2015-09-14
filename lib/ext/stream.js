'use strict';

var utils = require('../utils');
var $p; // promise wrapper;

// source and destination are both independent handlers that
// can control their own status fully; we are only providing THIS context;

// we are streaming until one of the following happens:
// 1. source returns a promise the rejects;
// 2. destination handler rejects;
// 3. source or destination throw an error;

// Destination isn't required to return a promise, but when it does,
// it is resolved before the next data is passed in;
// If the destination throws an error, streaming is rejected with that error;

// The source can return one promise only. It cannot provide non-promise data;
// The destination can handle only one promise at a time also.

// Q: What would be a method to do exactly the same, but deal with arrays also?
// A: page, channel, throttle?

/**
 * @method stream
 * @param source
 * @param dest
 */
function stream(source, dest) {

}

module.exports = function (promise) {
    $p = promise;
    return stream;
};
