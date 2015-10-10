'use strict';

/////////////////////////////////////
// Simpler check for null/undefined;
function isNull(value) {
    return value === null || value === undefined;
}

/////////////////////////////////////
// Checks if the value is a promise;
function isPromise(value) {
    return value && value.then instanceof Function;
}

///////////////////////////////////////////////////////
// Sets an object property as read-only and enumerable.
function property(obj, name, value) {
    Object.defineProperty(obj, name, {
        value: value,
        enumerable: true,
        writable: false
    });
}

////////////////////////////////////////////////////////////
// Sets an object property as read-only and non-enumerable.
function extend(obj, name, value) {
    Object.defineProperty(obj, name, {
        value: value,
        enumerable: false,
        writable: false
    });
}

/////////////////////////////////////////////////////
// Resolves a mixed value into the actual value,
// consistent with the way mixed values are defined:
// https://github.com/vitaly-t/spex/wiki/Mixed-Values
function resolve(value, params, onSuccess, onError) {

    var self = this,
        delayed = false;

    function loop() {
        while (value instanceof Function) {
            try {
                value = params ? value.apply(self, params) : value.call(self);
            } catch (e) {
                onError(e);
                return;
            }
        }
        if (isPromise(value)) {
            value
                .then(function (data) {
                    delayed = true;
                    value = data;
                    loop();
                }, function (reason) {
                    onError(reason);
                });
        } else {
            onSuccess(value, delayed);
        }
    }

    loop();
}

module.exports = function (/*config*/) {
    return {
        isNull: isNull,
        isPromise: isPromise,
        property: property,
        extend: extend,
        resolve: resolve
    };
};
