'use strict';

/**
 * @method batch
 * @summary Resolves a predefined array of $[mixed values].
 * @description
 * Settles (resolves or rejects) every $[mixed value] in the input array, and resolves
 * with an array of results, if all values have been resolved, or else rejects.
 *
 * This method resembles a fusion of `promise.all` + `promise.settle` logic, to resolve with
 * the same type of result as `promise.all`, while also settling all the promises, similar to
 * `promise.settle`, adding comprehensive details in case of a reject.
 *
 * **Alternative Syntax:**
 * `batch(values, {cb})`
 *
 * <img src="../images/batch.png" width="836px" height="210px" alt="batch">
 *
 * @param {Array} values
 * Array of $[mixed values], to be resolved asynchronously, in no particular order.
 *
 * Passing in anything other than an array will throw `Batch requires an array of values.`
 *
 * @param {Function} [cb]
 * Optional callback to receive the result for each settled value.
 *
 * Parameters:
 *  - `index` = index of the value in the source array
 *  - `success` - indicates whether the value was resolved (`true`), or rejected (`false`)
 *  - `result` = resolved data, if `success`=`true`, or else the rejection reason
 *  - `delay` = number of milliseconds since the last call (`undefined` when `index=0`)
 *
 * The function is called with the same `this` context as the calling method.
 *
 * It can optionally return a promise to indicate that notifications are handled asynchronously.
 * And if the returned promise resolves, it signals a successful handling, while any resolved
 * data is ignored.
 *
 * If the function returns a rejected promise or throws an error, the entire method rejects,
 * and the corresponding value in the rejected array is reported as `{success, result, origin}`:
 *  - `success` = `false`
 *  - `result` = the rejection reason or the error thrown by the notification callback
 *  - `origin` = the original data passed into the callback, as object `{success, result}`
 *
 * @returns {Promise}
 * Result for the entire batch, which resolves when every value in the input array has been resolved,
 * and rejects when:
 *  - one or more values in the array rejected or threw an error while being resolved as a $[mixed value]
 *  - one or more calls into the notification callback returned a rejected promise or threw an error
 *
 * The method resolves with an array of individual resolved results, the same as `promise.all`.
 * In addition, the array is extended with read-only property `duration` - number of milliseconds
 * taken to resolve all the data.
 *
 * When failed, the method rejects with an array of objects `[{success, result, [origin]}]`:
 *  - `success` = `true/false`, indicates whether the corresponding value in the input array was resolved.
 *  - `result` = resolved data, if `success=true`, or else the rejection reason.
 *  - `origin` - set only when failed as a result of an unsuccessful call into the notification callback
 *  (see documentation for parameter `cb`)
 *
 * In addition, the rejection array is extended with function `getErrors`, which returns the list of just
 * errors, with support for nested batch results. Calling `getErrors()[0]`, for example, will get the same
 * result as the rejection reason that `promise.all` would provide.
 *
 * In all cases, the output array is always the same size as the input one, providing index mapping
 * between the input values and the results.
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
        var cbTime, errors = [], sorted = false, remaining = values.length,
            result = new Array(remaining);
        values.forEach(function (item, i) {
            $utils.resolve.call(self, item, null, function (data) {
                result[i] = data;
                step(i, true, data);
            }, function (reason) {
                result[i] = {success: false, result: reason};
                errors.push(i);
                step(i, false, reason);
            });
        });
        function step(idx, pass, data) {
            if (cb) {
                var cbResult, cbNow = Date.now(),
                    cbDelay = idx ? (cbNow - cbTime) : undefined;
                cbTime = cbNow;
                try {
                    cbResult = cb.call(self, idx, pass, data, cbDelay);
                } catch (e) {
                    setError(e);
                }
                if ($utils.isPromise(cbResult)) {
                    cbResult
                        .then(function () {
                            check();
                        }, function (reason) {
                            setError(reason);
                            check();
                        });
                } else {
                    check();
                }
            } else {
                check();
            }

            function setError(e) {
                var r = pass ? {success: false} : result[idx];
                if (pass) {
                    result[idx] = r;
                    errors.push(idx);
                }
                r.result = e;
                r.origin = {success: pass, result: data}
            }

            function check() {
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

// `options` object-to-parameters wrapper;
function _batch(values, cb) {
    if ($utils.hasProperties(cb, ['cb'])) {
        return batch(cb, cb.cb);
    } else {
        return batch(values, cb);
    }
}

var $utils, $p;

module.exports = function (config) {
    $utils = config.utils;
    $p = config.promise;
    return _batch;
};
