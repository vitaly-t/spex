'use strict';

/**
 * @method batch
 * @summary Resolves a predefined array of $[mixed values].
 * @description
 * Settles every $[mixed value] in the input array, and resolves with the array of
 * results, if all values resolved, or rejects when one or more values rejected.
 *
 * This method is a fusion of `promise.all` + `promise.settle` logic, to resolve with
 * the same type of result as the standard `promise.all`, while also settling all the promises,
 * and providing a comprehensive rejection summary in case of any reject.
 *
 * @param {Array} values
 * Array of $[mixed values] to be resolved asynchronously, i.e. in no particular order.
 *
 * Passing in anything other than an array will throw `Batch requires an array of values.`
 *
 * @param {Function} [cb]
 * Optional callback to receive a notification about the resolution result for each value.
 *
 * Parameters:
 *  - `index` - index of the value in the array
 *  - `success` - indicates whether the value was resolved (`true`), or rejected (`false`)
 *  - `data` - resolved data, if `success`=`true`, or else the rejection reason
 *
 * The function is called with the same `this` context as the calling method.
 *
 * It can optionally return a promise object, to indicate that it handles notifications asynchronously.
 * If the returned promise resolves, it signals a successful notification, while any resolved data is ignored.
 *
 * If the function returns a rejected promise or throws an error, the entire method rejects, while the
 * rejected element is replaced with object `{success, result, origin}`:
 *  - `success` = `false`
 *  - `result` - the rejection reason or the error thrown by the notification callback
 *  - `origin` - the original data passed into the callback, as object `{success, result}`
 *
 * @returns {Promise}
 * Result for the entire batch, which resolves when every value in the input array has been resolved,
 * and rejects when:
 *  - one or more values in the array rejected
 *  - one or more calls into the notification callback returned a rejected promise or threw an error
 *
 * The method resolves with an array of individual resolved results, the same as `promise.all`.
 * In addition, the array is extended with read-only property `duration` - number of milliseconds
 * taken to resolve all the data.
 *
 * When failed, the method rejects with an array of objects `{success, result}`:
 *  - `success`: `true/false`, indicates whether the corresponding value in the input array was resolved.
 *  - `result`: resolved data, if `success=true`, or else the rejection reason.
 *
 * In addition, the array is extended with function `getErrors`, which returns the list of just errors,
 * with support for nested batch results. Calling `getErrors()[0]`, for example, will get the same
 * result as the rejection reason that `promise.all` would provide.
 *
 * When a value in the array represents a failure that's the result of an unsuccessful call into the
 * notification callback, it will also have property `origin`. See documentation for parameter `cb`.
 *
 * In both cases the output array is always the same size as the input one, providing index mapping
 * between input and output values.
 */

function batch(values, cb) {
    if (!Array.isArray(values)) {
        throw new TypeError("Batch requires an array of values.");
    }
    if (!$utils.isNull(cb) && typeof cb !== 'function') {
        throw new TypeError("Invalid callback function specified.");
    }
    if (!values.length) {
        var empty = [];
        $utils.extend(empty, 'duration', 0);
        return $p.resolve(empty);
    }
    var self = this, start = Date.now();
    return $p(function (resolve, reject) {
        var errors = [], sorted = false, remaining = values.length,
            result = new Array(remaining);
        values.forEach(function (item, i) {
            $utils.resolve.call(self, item, null, function (data) {
                result[i] = data;
                check(i, true, data);
            }, function (reason) {
                result[i] = {success: false, result: reason};
                errors.push(i);
                check(i, false, reason);
            });
        });
        function check(idx, pass, data) {
            if (cb) {
                var cbResult;
                try {
                    cbResult = cb.call(self, idx, pass, data);
                } catch (e) {
                    fixError(e);
                }
                if ($utils.isPromise(cbResult)) {
                    cbResult
                        .then(function () {
                            verify();
                        }, function (reason) {
                            fixError(reason);
                            verify();
                        });
                } else {
                    verify();
                }
            } else {
                verify();
            }

            function fixError(e) {
                var r = pass ? {success: false} : result[idx];
                if (pass) {
                    result[idx] = r;
                    errors.push(idx);
                }
                r.result = e;
                r.origin = {success: pass, result: data}
            }

            function verify() {
                if (--remaining) {
                    return;
                }
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
                    $utils.extend(result, 'getErrors', function () {
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
                    $utils.extend(result, 'duration', Date.now() - start);
                    resolve(result);
                }
            }
        }
    });
}

var $utils, $p;

module.exports = function (config) {
    $utils = config.utils;
    $p = config.promise;
    return batch;
};
