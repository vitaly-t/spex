'use strict';

/**
 * @method delay
 * @summary Creates a conditional, cancellable delay - promise;
 *
 * @param {Number} timeout
 * @param [condition]
 * @param [data]
 */
function delay(timeout, condition, data) {
    var wait = (parseInt(timeout) === timeout && timeout > 0) ? timeout : 0;
    var self = this, start = Date.now(), timer, rej;
    var result = $p(function (resolve, reject) {
        rej = reject;
        $utils.resolve.call(self, condition, null, function (value) {
            var duration = Date.now() - start;
            if (value) {
                if (duration >= wait) {
                    resolve(data);
                } else {
                    timer = setTimeout(function () {
                        timer = null;
                        resolve(data);
                    }, wait - duration);
                }
            } else {
                reject();
            }
        }, function (reason) {
            reject(reason)
        });
    });
    result.cancel = function (reason) {
        if (timer) {
            clearTimeout(timer);
            timer = null;
            rej(reason);
            return true;
        }
        return false;
    };
    return result;
}

var $utils, $p;

module.exports = function (config) {
    $utils = config.utils;
    $p = config.promise;
    return delay;
};
