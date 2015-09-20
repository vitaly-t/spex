'use strict';

var $utils, $p;

// This method is identical to `sequence`, except it does paging.

// RESOLVES:
// {duration, pages, total}, when `undefined` or `[]` returned from the source function;

// REJECTS:
// 1. {index, error} - source returned invalid value, error="Invalid value!"
// 2. {index, error, source} - source rejected or returned an error;
// 3. {index, data} - data page rejected;
// 4. {index, error, dest} - destination function rejected or threw an error;

// Source format: (index, data);
// Destination format: (index, data);
// + THIS context;

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

    maxSize = (parseInt(maxSize) === maxSize && maxSize > 0) ? maxSize : 0;

    var self = this, request, start = Date.now(), total = 0;

    return $p(function (resolve, reject) {

        function loop(idx) {
            $utils.resolve.call(self, source, [idx, request], function (value) {
                if (value === undefined) {
                    finish(); // no more pages left;
                } else {
                    if (value instanceof Array) {
                        if (!value.length) {
                            finish();
                        } else {
                            $utils.batch(value)
                                .then(function (data) {
                                    request = data;
                                    total += data.length;
                                    // batch was successful, notify;
                                    if (dest) {
                                        var destResult;
                                        try {
                                            destResult = dest.call(self, idx, data);
                                        } catch (err) {
                                            reject({
                                                index: idx,
                                                error: err,
                                                dest: data
                                            });
                                            return;
                                        }
                                        if ($utils.isPromise(destResult)) {
                                            destResult
                                                .then(function () {
                                                    next();
                                                }, function (reason) {
                                                    reject({
                                                        index: idx,
                                                        error: reason,
                                                        dest: data
                                                    });
                                                });
                                        } else {
                                            next();
                                        }
                                    } else {
                                        next();
                                    }
                                }, function (reason) {
                                    reject({
                                        index: idx,
                                        data: reason
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
            }, function (reason) {
                reject({
                    index: idx,
                    error: reason,
                    source: request
                });
            });

            function next() {
                idx++;
                if (maxSize === idx) {
                    finish();
                } else {
                    loop(idx);
                }
            }

            function finish() {
                resolve({
                    pages: idx,
                    total: total,
                    duration: Date.now() - start
                });
            }
        }

        loop(0);
    });

}

module.exports = function (config) {
    $utils = config.utils;
    $p = config.promise;
    return page;
};
