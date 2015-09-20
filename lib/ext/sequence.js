'use strict';

var $utils, $p;

// Resolves based on `track`: with array, extended with `duration`, if `track`=true;
// with {total, duration}, if track is false;

// Rejects with {index, error, [source], [dest]}

// Resolves based on noTracking, i.e. by default, that an array of resolved values,
// extended with `duration`,  or else - {total, duration} (same as stream);

// When either functions throw an error or dest rejects,
// rejects with {index, error, [data]} if `data` is specified, that's the resolved data,
// which means it was the destination that threw the error or rejected;
// `data` takes resolved data, without index;

/**
 * @method sequence
 * @summary Sequentially resolves a dynamic chain of promises.
 * @description
 * Acquires mixed values from the source function, one at a time, and resolves them.
 * @param {function} source
 * Creates and returns the next [mixed value] to be resolved.
 * Returning nothing / `undefined` indicates the end of the sequence.
 *
 * Function parameters:
 *  - `index` - current index of the sequence;
 *  - `data` - resolved value from the previous call to the function. It is `undefined`
 *  for the initial call.
 *
 * based on the request index passed. When the value is anything other than a function, an error
 * is thrown: `Invalid factory function specified.`
 * @param {function} [dest] - notification callback with `(idx, data)`, for every request resolved.
 * @param {Integer} [limit=0]
 * @param {Boolean} [track=false] - when `true`, it prevents tracking resolved results from
 * individual query requests, to avoid memory overuse when processing massive data.
 * @returns {Promise} Result of the sequence, depending on `noTracking`:
 * - resolves with an array of resolved data, if `noTracking = false`;
 * - resolves with an integer - total number of resolved requests, if `noTracking = true`;
 * - rejects with the reason when the factory function throws an error or returns a rejected promise.
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

module.exports = function (config) {
    $utils = config.utils;
    $p = config.promise;
    return sequence;
};

/**
[mixed values]:https://google.com
*/

