'use strict';

var $utils, $p;

// This method is identical to `sequence`, except it does paging.

// Resolves with {duration, pages, total};
// Acquires next page via page index + THIS context;
// Provides pages tracking: dest(pageIdx, data)

// Stops when:
// a. An `undefined` or an empty array (resolves);
// b. source or dest throw an error (rejects);
// c. rejects with `invalid data` when something else returns from the source;

// When source or dest throw an error, or dest rejects - rejects with that error {pageIdx, error};
// When a regular promise rejects, we can still reject with that error? But we need the page also {pageIdx, error};

// The method will use the batch to resolve arrays.
// Dest will be receiving data from the batch directly.

// Destination isn't required to return a promise, but when it does,
// it is resolved before the next data is passed in;

/**
 * @method page
 * @summary Resolves dynamic arrays/pages of promises;
 * @param {function} source
 * @param {function} [dest]
 */
function page(source, dest) {
}

module.exports = function (config) {
    $utils = config.utils;
    $p = config.promise;
    return page;
};
