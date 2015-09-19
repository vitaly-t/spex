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

// Stream vs Sequence: stream is for independent sources, and no data tracking supported;
// Sequence is for index-bases source, tracking resolved data by default;

/**
 * @method sequence
 * @summary Resolves a sequence of dynamic promises until no data left.
 * @param {Function} source - a callback function `(idx, data)` to create and return a new promise,
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
function sequence(source, dest, track) {

    if (typeof source !== 'function') {
        throw new Error("Invalid sequence source.");
    }

    if (!$utils.isNull(dest) && typeof dest !== 'function') {
        throw new Error("Invalid sequence destination.");
    }

    var self = this, data, result = [], start = Date.now(), params = new Array(2);

    return $p(function (resolve, reject) {

        function loop(idx) {
            params[0] = idx;
            params[1] = data;
            utils.resolve.call(self, source, params, function (value) {
                data = value;
                if (data === undefined) {
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
                    resolve(result);
                } else {
                    // sequence continues;
                    if (track) {
                        result.push(value); // accumulate resolved data;
                    }
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
                        if (utils.isPromise(destResult)) {
                            destResult
                                .then(function () {
                                    loop(++idx);
                                }, function (reason) {
                                    reject({
                                        dest: data,
                                        index: idx,
                                        error: reason
                                    });
                                });
                        } else {
                            loop(++idx);
                        }
                    } else {
                        loop(++idx);
                    }
                }
            }, function (reason) {
                reject({
                    source: request,
                    index: idx,
                    error: reason
                });
            });
        }

        loop(0);
    });
}

module.exports = function (config) {
    $utils = config.utils;
    $p = config.promise;
    return sequence;
};
