'use strict';

var utils = require('../utils');
var $p; // promise wrapper;

// Resolves with {duration, pages, total};
// Acquires next page via page index + THIS context;
// Provides pages tracking: cb(pageIdx, data)

// Stops when:
// a. A non-array returned or an empty array (resolves);
// b. source or cb throw an error (rejects);

// Normally rejects with? Should be like batch, except replacing
// whole page of data with the error context;

// Perhaps it will make more sense, if the implementation uses
// method batch.

/**
 * @method page
 * @summary Resolves dynamic arrays/pages of promises;
 * @param source
 * @param cb
 */
function page(source, cb) {
}

module.exports = function (config) {
    $p = config.promise;
    return page;
};
