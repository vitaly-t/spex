'use strict';

/**
 * @method page
 * @summary Resolves a dynamic sequence of arrays/pages with $[mixed values].
 * @description
 * Acquires pages (arrays of $[mixed values]) from the source function, one by one,
 * and resolves each page as a $[batch], till no more pages left or an error occurs.
 * @param {function} source
 * Expected to return the next page of data (array of $[mixed values]) to be resolved.
 * Returning nothing (`undefined`) or an empty array signals the end of the sequence.
 *
 * If the function returns anything other than an array or `undefined`, the method will
 * reject with object `{index, error}`:
 *  - `index` - index of the page for which the request failed
 *  - `error` = `Unexpected data returned from the source.`
 *
 * The function is called with the same `this` context as the calling method.
 *
 * Parameters:
 *  - `index` - index of the page being requested
 *  - `data` - previously returned page, resolved as a $[batch], `undefined` when `index=0`
 *
 * If the function throws an error or returns a rejected promise, the sequence terminates,
 * and the method rejects with object `{index, error, source}`:
 *  - `index` - index of the request that failed
 *  - `error` - the error thrown or the reject reason
 *  - `source` - resolved `data` that was passed into the function
 *
 * Passing in anything other than a function will throw `Invalid page source.`
 *
 * @param {function} [dest]
 * @param {Integer} [limit=0]
 * @returns {Promise}
 */
function page(source, dest, limit) {

    if (typeof source !== 'function') {
        throw new TypeError("Invalid page source.");
    }

    if (!$utils.isNull(dest) && typeof dest !== 'function') {
        throw new TypeError("Invalid page destination.");
    }

    limit = (parseInt(limit) === limit && limit > 0) ? limit : 0;

    var self = this, request, start = Date.now(), total = 0;

    return $p(function (resolve, reject) {

        function loop(idx) {
            $utils.resolve.call(self, source, [idx, request], function (value) {
                if (value === undefined) {
                    finish();
                } else {
                    if (value instanceof Array) {
                        if (!value.length) {
                            finish();
                        } else {
                            $spex.batch(value)
                                .then(function (data) {
                                    request = data;
                                    total += data.length;
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
                            error: "Unexpected data returned from the source."
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
                if (limit === idx) {
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

var $spex, $utils, $p;

module.exports = function (config) {
    $spex = config.spex;
    $utils = config.utils;
    $p = config.promise;
    return page;
};
