'use strict';

var $utils, $p;

// A dependent version of `sequence`, where each next promise is created
// based on the data result from the previous one.

// Q: Rejecting with data: not clear whether it is the source or destination
// {index, error, [source], [dest]}: source - data rejected by the source,
// dest - data rejected by the destination;

/**
 * @method chain
 * @summary Resolves a linked sequence of dynamic promises.
 * @param source
 */
function chain(source, dest, noTracking) {

    if (typeof source !== 'function') {
        throw new Error("Invalid chain source.");
    }

    if (!$utils.isNull(dest) && typeof dest !== 'function') {
        throw new Error("Invalid chain destination.");
    }

    var self = this, idx = 0, request, result = [], start = Date.now();

    function loop() {
        var value;
        try {
            value = factory.call(self, request);
        } catch (e) {
            return $p.reject({
                source: request,
                index: idx,
                error: e
            });
        }
        while (value instanceof Function) {
            try {
                value = value.call(self, request);
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
                request = data;
                if (!noTracking) {
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
    return chain;
};
