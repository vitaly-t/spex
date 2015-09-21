'use strict';

/////////////////////////////////////
// Simpler check for null/undefined;
function isNull(value) {
    return value === null || value === undefined;
}

///////////////////////////////////////////
// Check if the value is a promise object;
function isPromise(value) {
    return value && value.then instanceof Function;
}

/////////////////////////////////////////////////////
// Sets a read-only enumerable property on an object.
function property(obj, name, value) {
    Object.defineProperty(obj, name, {
        value: value,
        enumerable: true,
        writable: false
    });
}

/////////////////////////////////////////////////////
// Extends an object with a non-enumerable read-only
// method or property.
function extend(obj, name, value) {
    Object.defineProperty(obj, name, {
        value: value,
        enumerable: false,
        writable: false
    });
}

// Resolves value into a simple value,
// supporting nested functions and promises;
// passes params and its own context into the functions;
// params - array of parameters;
function resolve(value, params, onSuccess, onError) {

    var self = this, async = false;

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
                    async = true;
                    value = data;
                    loop();
                }, function (reason) {
                    onError(reason);
                });
        } else {
            onSuccess(value, async);
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
