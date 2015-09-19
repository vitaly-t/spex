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

// We need to indicate clearly the nature if failure:
// 1. error or reject from the source {index, error;};
// 2. page rejected (batch returned reject) {index, data=batch reject data};
// 3. dest rejected or threw an error {index, error, dest=resolved data passed in};

// IMPORTANT: source can return a promise to resolve with array or `undefined`;
// NEED: generic resolver for such things everywhere!


/**
 * @method page
 * @summary Resolves dynamic arrays/pages of promises;
 * @param {function} source
 * @param {function} [dest]
 */
function page(source, dest, maxSize) {

    if (typeof source !== 'function') {
        throw new Error("Invalid page source.");
    }

    if (!$utils.isNull(dest) && typeof dest !== 'function') {
        throw new Error("Invalid page destination.");
    }

    var self = this, result = [], start = Date.now();
/*
    return $p(function (resolve, reject) {

        function loop(idx) {
            $utils.resolve.call(self, source, [idx], function (value, delayed) {
                if (value === undefined) {
                    // no more pages left;
                    finish();
                } else {
                    if (value instanceof Array) {
                        if (!value.length) {
                            finish();
                        } else {
                            // carry one;
                            $utils.batch(value)
                                .then(function (data) {

                                }, function (reason) {
                                    reject({
                                        error: reason,
                                        index: idx,
                                        data: value
                                    });
                                });
                        }
                    } else {
                        reject({
                            index: idx,
                            error: "Invalid data returned"
                        });
                    }
                }


                // sequence continues;

                if (dest) {
                    var destResult;
                    try {
                        destResult = dest.call(self, idx, value);
                    } catch (e) {
                        reject({
                            dest: data,
                            index: idx,
                            error: e
                        });
                        return;
                    }
                    if ($utils.isPromise(destResult)) {
                        destResult
                            .then(function () {
                                next(true);
                            }, function (reason) {
                                reject({
                                    dest: data,
                                    index: idx,
                                    error: reason
                                });
                            });
                    } else {
                        next(delayed);
                    }
                } else {
                    next(delayed);
                }

            }, function (reason) {
                reject({
                    source: data,
                    index: idx,
                    error: reason
                });
            });

            function next(delayed) {
                idx++;
                if (maxSize && maxSize === idx) {
                    finish();
                } else {
                    if (delayed) {
                        loop(idx);
                    } else {
                        $p.resolve()
                            .then(function () {
                                loop(idx);
                            });
                    }
                }
            }

            function finish() {
                var length = Date.now() - start;
                if (track) {
                    $utils.extend(result, 'duration', length);
                } else {
                    result = {
                        total: idx,
                        duration: length
                    }
                }
                resolve(result);
            }
        }

        loop(0);
    });
*/
}

module.exports = function (config) {
    $utils = config.utils;
    $p = config.promise;
    return page;
};
