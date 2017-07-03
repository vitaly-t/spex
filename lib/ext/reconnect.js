'use strict';

/**
 * @method reconnect
 * @description
 */
function reconnect(/*options, config*/) {
    //var $p = config.promise;
}

module.exports = function (config) {
    return function (options) {
        return reconnect.call(this, options, config);
    };
};
