'use strict';

var $utils, $p;

/**
 * @method sequence
 * @summary Resolves an independent sequence of dynamic promises.
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
function sequence(factory, noTracking, cb) {

    if (typeof factory !== 'function') {
        throw new Error("Invalid factory function specified.");
    }

    var self = this, idx = 0, result = [];

    function loop() {
        var obj;
        try {
            obj = factory.call(self, idx, self); // get next promise;
        } catch (e) {
            return $p.reject(e);
        }
        if ($utils.isNull(obj)) {
            // no more promises left in the sequence;
            return $p.resolve(noTracking ? idx : result);
        }
        if (!$utils.isPromise(obj)) {
            // the result is not a promise;
            return $p.reject("Invalid promise returned by factory for index " + idx);
        }
        return obj
            .then(function (data) {
                if (!noTracking) {
                    result.push(data); // accumulate resolved data;
                }
                if (cb instanceof Function) {
                    try {
                        cb(idx, data);
                    } catch (err) {
                        return $p.reject(err);
                    }
                }
                idx++;
                return loop();
            });
    }

    return loop();
}

module.exports = function (config) {
    $utils = config.utils;
    $p = config.promise;
    return sequence;
};
