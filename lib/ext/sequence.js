'use strict';

var $utils, $p;

// Resolves based on noTracking, i.e. by default, that an array of resolved values,
// extended with `duration`,  or else - {total, duration} (same as stream);

// When either functions throw an error or dest rejects,
// rejects with {index, error, [data]} if data is specified, that's the resolved data,
// which means it was the destination that threw the error or rejected;
// dest takes resolved data, without index;

// Stream vs Sequence: stream is for independent sources, and no data tracking supported;
// Sequence is for index-bases source, tracking resolved data by default;

/**
 * @method sequence
 * @summary Resolves an independent sequence of dynamic promises until no data left.
 * @param {Function} factory - a callback function `(idx, t)` to create and return a new promise,
 * based on the request index passed. When the value is anything other than a function, an error
 * is thrown: `Invalid factory function specified.`
 * @param {Boolean} [noTracking=false] - when `true`, it prevents tracking resolved results from
 * individual query requests, to avoid memory overuse when processing massive data.
 * @param {Function} [cb] - notification callback with `(idx, data)`, for every request resolved.
 * @returns {Promise} Result of the sequence, depending on `noTracking`:
 * - resolves with an array of resolved data, if `noTracking = false`;
 * - resolves with an integer - total number of resolved requests, if `noTracking = true`;
 * - rejects with the reason when the factory function throws an error or returns a rejected promise.
 */
function sequence(source, dest, noTracking) {

    if (typeof source !== 'function') {
        throw new Error("Invalid sequence source.");
    }

    if (!$utils.isNull(dest) && typeof dest !== 'function') {
        throw new Error("Invalid sequence destination.");
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
                value = value.call(self);
            } catch (e) {
                return $p.reject({
                    index: idx,
                    error: e
                });
            }
        }
        if (value === undefined) {
            // no more data left in the sequence;
            var length = Date.now() - start;
            if (noTracking) {
                result = {
                    total: idx,
                    duration: length
                }
            } else {
                $utils.extend(result, 'duration', length);
            }
            return $p.resolve(result);
        }
        if (!$utils.isPromise(value)) {
            value = $p.resolve(value); // to avoid direct recursion;
        }
        return value
            .then(function (data) {
                if (!noTracking) {
                    result.push(data); // accumulate resolved data;
                }
                var destResult;
                if (dest) {
                    try {
                        destResult = dest.call(self, idx, {
                            index: idx,
                            data: data
                        });
                    } catch (e) {
                        return $p.reject({
                            data: data,
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
                                    data: data,
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
    return sequence;
};
