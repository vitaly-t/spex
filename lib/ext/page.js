'use strict';

var $utils, $p;

// This method is identical to `sequence`, except it does paging.

// Resolves with {duration, pages, total};
// Acquires next page via page index + THIS context + previous data;
// Provides pages tracking: dest(pageIdx, data)

// Stops when:
// a. An `undefined` or an empty array (resolves);
// b. source or dest throw an error (rejects);
// c. rejects with `invalid data` when something else returns from the source;

// When source or dest throw an error, or dest rejects - rejects with that error {pageIdx, error};
// When a regular promise rejects, we can still reject with that error? But we need the page also {pageIdx, error};

// We need to indicate clearly the nature if failure:
// 1. error or reject from the source {index, error, source=last data passed;};
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

    var self = this, idx = 0, result = [], start = Date.now();

    function loop() {
        var value;
        try {
            value = factory.call(self, idx);
        } catch (e) {
            return $p.reject({
                index: idx,
                error: e
            });
        }
        while (value instanceof Function) {
            try {
                value = value.call(self, idx, request);
            } catch (e) {
                return $p.reject({
                    source: request,
                    index: idx,
                    error: e
                });
            }
        }
        if (value === undefined) {
            // no more data left in the sequence;
            var length = Date.now() - start;
            if (track) {
                $utils.extend(result, 'duration', length);
            } else {
                result = {
                    total: idx,
                    duration: length
                }
            }
            return $p.resolve(result);
        }
        if (!$utils.isPromise(value)) {
            value = $p.resolve(value); // to avoid direct recursion;
        }
        return value
            .then(function (data) {
                request = data;
                if (track) {
                    result.push(data); // accumulate resolved data;
                }
                var destResult;
                if (dest) {
                    try {
                        destResult = dest.call(self, idx, data);
                    } catch (e) {
                        return $p.reject({
                            dest: data,
                            index: idx,
                            error: e
                        });
                    }
                    if (utils.isPromise(destResult)) {
                        return destResult
                            .then(function () {
                                idx++;
                                return loop();
                            }, function (reason) {
                                return $p.reject({
                                    dest: data,
                                    index: idx,
                                    error: reason
                                });
                            });
                    }
                }
                idx++;
                return loop();
            }, function (reason) {
                return $p.reject({
                    index: idx,
                    error: reason
                });
            });
    }

    return loop();
}

module.exports = function (config) {
    $utils = config.utils;
    $p = config.promise;
    return page;
};
