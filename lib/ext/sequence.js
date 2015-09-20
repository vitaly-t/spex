'use strict';

/**
 * @method sequence
 * @summary Resolves a dynamic sequence of $[mixed values].
 * @description
 * Acquires $[mixed values] from the source function, one at a time, and resolves them,
 * till either no more values left in the sequence or an error occurs.
 * @param {function} source
 * Expected to return the next $[mixed value] to be resolved. When the function
 * returns nothing (`undefined`), it indicates the end of the sequence.
 *
 * Function parameters:
 *  - `index` - current request index in the sequence;
 *  - `data` - resolved data from the previous call to the function (`undefined`
 *  for the initial call).
 *
 * The function is called with the same `this` context as the calling method.
 *
 * If the function throws an error or returns a rejected promise, the sequence terminates,
 * and the method rejects with object `{index, error, source}`:
 *  - `index` - index of the request that failed
 *  - `error` - the error thrown or the reject reason
 *  - `source` - resolved data that was passed into the function
 *
 * Passing in anything other than a function will throw `Invalid sequence source.`.
 *
 * @param {function} [dest]
 * Optional destination function (notification callback), to receive resolved data for each index,
 * process it and respond as required.
 *
 * Function parameters:
 *  - `index` - index of the resolved data in the sequence
 *  - `data` - the data resolved
 *
 * The function is called with the same `this` context as the calling method.
 *
 * It can optionally return a promise object, if data processing is done asynchronously.
 * If a promise is returned, the method will not request the next value from the `source` function,
 * until the promise has been resolved.
 *
 * If the function throws an error or returns a promise that rejects, the sequence terminates,
 * and the method rejects with object `{index, error, dest}`:
 * - `index` - index of the data that was processed
 * - `error` - the error thrown or the reject reason
 * - `dest` - resolved data that was passed into the function
 *
 * Passing in anything other than a function will throw `Invalid sequence destination.`.
 *
 * @param {Integer} [limit=0]
 * Limits the maximum size of the sequence. If the value is an integer greater than 0,
 * the method will successfully resolve once the specified size limit has been reached.
 * By default, the sequence is unlimited.
 *
 * @param {Boolean} [track=false]
 * The value of this parameter changes the type of data to be resolved by this method.
 * When set to be `true`, it instructs the method to track/collect all resolved data into
 * an array internally, so it can be resolved with once the method has finished successfully.
 *
 * It must be used with caution, as to the size of the sequence, because accumulating data for
 * a very large sequence can result in consuming too much memory.
 *
 * @returns {Promise}
 * When successful, the resolved data depends on parameter `track`. When `track` is `false`
 * (default), the method resolves with object `{total, duration}`:
 *  - `total` - total number of values resolved from the sequence
 *  - `duration` - number of milliseconds consumed by the method
 *
 * When `track` is `true`, the method resolves with an array of all the data that has been resolved.
 * The array comes extended with read-only property `duration` - number of milliseconds consumed by the method.
 *
 * If the method fails, it rejects with an object according to which of the two functions caused
 * the failure - `source` or `dest`. See the two parameters for the rejection details.
 */
function sequence(source, dest, limit, track) {

    if (typeof source !== 'function') {
        throw new Error("Invalid sequence source.");
    }

    if (!$utils.isNull(dest) && typeof dest !== 'function') {
        throw new Error("Invalid sequence destination.");
    }

    limit = (parseInt(limit) === limit && limit > 0) ? limit : 0;

    var self = this, data, result = [], start = Date.now();

    return $p(function (resolve, reject) {

        function loop(idx) {
            $utils.resolve.call(self, source, [idx, data], function (value, delayed) {
                data = value;
                if (data === undefined) {
                    // no more data left in the sequence;
                    finish();
                } else {
                    // sequence continues;
                    if (track) {
                        result.push(data); // accumulate resolved data;
                    }
                    if (dest) {
                        var destResult;
                        try {
                            destResult = dest.call(self, idx, data);
                        } catch (e) {
                            reject({
                                index: idx,
                                error: e,
                                dest: data
                            });
                            return;
                        }
                        if ($utils.isPromise(destResult)) {
                            destResult
                                .then(function () {
                                    next(true);
                                }, function (reason) {
                                    reject({
                                        index: idx,
                                        error: reason,
                                        dest: data
                                    });
                                });
                        } else {
                            next(delayed);
                        }
                    } else {
                        next(delayed);
                    }
                }
            }, function (reason) {
                reject({
                    index: idx,
                    error: reason,
                    source: data
                });
            });

            function next(delayed) {
                idx++;
                if (limit === idx) {
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
}

var $utils, $p;

module.exports = function (config) {
    $utils = config.utils;
    $p = config.promise;
    return sequence;
};
