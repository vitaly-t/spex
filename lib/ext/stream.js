'use strict';

var $utils, $p;

// source and destination are both independent handlers that
// can control their own status fully; we are only providing THIS context;

// we are streaming until one of the following happens:
// 1. source returns a promise the rejects;
// 2. destination handler rejects;
// 3. source or destination throw an error;
// 4. source returns `undefined`;

// Destination isn't required to return a promise, but when it does,
// it is resolved before the next data is passed in;
// If the destination throws an error, streaming is rejected with that error;

// The destination can handle only one promise at a time.

// Once finished, resolves with {total, duration}.

/**
 * @method stream
 * @summary Resolves promises one-by-one from source to destination.
 * @description
 * Acquires promise objects dynamically from the source function, resolves them,
 * and passes the result into the destination function.
 * @param source
 * @param dest
 */
function stream(source, dest) {
    if (typeof source !== 'function') {
        throw new Error("Invalid source function specified.");
    }
    if (typeof dest !== 'function') {
        throw new Error("Invalid destination function specified.");
    }
    var self = this, count = 0, start = Date.now();

    function loop() {
        var value;
        try {
            value = source.call(self);
        } catch (e) {
            return $p.reject(e);
        }
        while (value instanceof Function) {
            try {
                value = value.call(self);
            } catch (e) {
                return $p.reject(e);
            }
        }
        if (value === undefined) {
            // no more data left in the source;
            return $p.resolve({
                total: count,
                duration: Date.now() - start
            });
        }
        if (!$utils.isPromise(value)) {
            value = $p.resolve(value); // to avoid direct recursion;
        }
        return value
            .then(function (data) {
                var response;
                try {
                    response = dest.call(self, data);
                } catch (e) {
                    return $p.reject(e);
                }
                if ($utils.isPromise(response)) {
                    return response
                        .then(function () {
                            count++;
                            return loop();
                        });
                }
                count++;
                return loop();
            });
    }

    return loop();
}

module.exports = function (config) {
    $utils = config.utils;
    $p = config.promise;
    return stream;
};
