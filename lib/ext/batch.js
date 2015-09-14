'use strict';

var utils = require('../utils');
var $p; // promise wrapper;

/**
 * @method batch
 * @summary Attempts to resolve every value in the input array.
 * @description
 * This method is a fusion of `promise.all` + `promise.settle` logic,
 * to resolve with the same type of result as `promise.all`, while also
 * settling all the promises, and providing a detailed summary in case
 * any of the promises rejects.
 *
 * @param {Array} values - array of values of the following types:
 * - a simple value or object, to resolve with by default;
 * - a promise object to be either resolved or rejected;
 * - a function, to be called with the task/transaction context,
 *   so it can return a value, an object or a promise.
 *   If it returns another function, the call will be repeated,
 *   until the returned type is a value, an object or a promise.
 *
 * If the parameter is anything other than an array, an error will
 * be thrown: `Array of values is required to execute a batch.`
 *
 * @param {Function} [cb]
 *
 * @returns {Promise} Result for the entire batch, which resolves when
 * every promise in the input array has been resolved, and rejects when one
 * or more promise objects in the array rejected:
 * - resolves with an array of individual resolved results, the same as `promise.all`;
 *
 *   The array comes extended with property `duration` - number of milliseconds
 *   taken to resolve all the data.
 *
 * - rejects with an array of objects `{success, result}`:
 *   - `success`: `true/false`, indicates whether the corresponding value
 *     in the input array was resolved.
 *   - `result`: resolved data, if `success=true`, or else the rejection reason.
 *
 *   The array comes extended with function `getErrors`, which returns the list
 *   of just errors, with support for nested batch results.
 *   Calling `getErrors()[0]`, for example, will get the same result as the
 *   rejection reason that `promise.all` would provide.
 *
 * In both cases the output array is always the same size as the input one,
 * providing index mapping between input and output values.
 */
function batch(values, cb) {
    if (!Array.isArray(values)) {
        throw new Error("Array of values is required to execute a batch.");
    }
    if (!utils.isNull(cb) && typeof cb !== 'function') {
        throw new Error("Invalid callback function specified.");
    }
    if (!values.length) {
        var empty = [];
        utils.extend(empty, 'duration', 0);
        return $p.resolve(empty);
    }
    var self = this, start = Date.now();
    return $p(function (resolve, reject) {
        var errors = [], sorted = false, remaining = values.length,
            result = new Array(remaining);
        values.forEach(function (item, i) {
            var err;
            while (item instanceof Function) {
                try {
                    item = item.call(self, self);
                } catch (e) {
                    err = e;
                    break;
                }
            }
            if (err) {
                result[i] = {success: false, result: err};
                errors.push(i);
                check(i, false, err);
            } else {
                if (utils.isPromise(item)) {
                    item
                        .then(function (data) {
                            result[i] = data;
                            check(i, true, data);
                        }, function (reason) {
                            result[i] = {success: false, result: reason};
                            errors.push(i);
                            check(i, false, reason);
                        });
                } else {
                    result[i] = item;
                    check(i, true, item);
                }
            }
        });
        function check(idx, pass, data) {
            if (cb instanceof Function) {
                try {
                    cb.call(self, pass, data);
                } catch (e) {
                    var r = pass ? {success: false} : result[idx];
                    if (pass) {
                        result[idx] = r;
                        errors.push(idx);
                    }
                    r.result = e;
                    r.origin = {success: pass, result: data}
                }
            }
            if (!--remaining) {
                if (errors.length) {
                    if (errors.length < result.length) {
                        errors.sort();
                        sorted = true;
                        for (var i = 0, k = 0; i < result.length; i++) {
                            if (i === errors[k]) {
                                k++;
                            } else {
                                result[i] = {success: true, result: result[i]};
                            }
                        }
                    }
                    utils.extend(result, 'getErrors', function () {
                        if (!sorted) {
                            errors.sort();
                            sorted = true;
                        }
                        var err = new Array(errors.length);
                        for (var i = 0; i < errors.length; i++) {
                            err[i] = result[errors[i]].result;
                            if (err[i] instanceof Array && err[i].getErrors instanceof Function) {
                                err[i] = err[i].getErrors();
                            }
                        }
                        return err;
                    });
                    reject(result);
                } else {
                    utils.extend(result, 'duration', Date.now() - start);
                    resolve(result);
                }
            }
        }
    });
}

module.exports = function (promise) {
    $p = promise;
    return batch;
};
