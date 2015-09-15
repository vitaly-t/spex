'use strict';

var $p; // promise wrapper;

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

// Shared functions for methods: batch, sequence, chain, stream;
function resolveValue(value, onResolve, onReject, onEmpty) {
    while (value instanceof Function) {
        try {
            value = value.call(this);
        } catch (e) {
            onReject(e);
            return;
        }
    }
    if (isPromise(value)) {
        value
            .then(function (data) {
                onResolve(data);
            }, function (reason) {
                onReject(reason);
            });
    } else {
        if (value === undefined && onEmpty instanceof Function) {
            onEmpty();
        } else {
            onResolve(value);
        }
    }
}

module.exports = function (config) {
    $p = config.promise;
    return {
        isNull: isNull,
        isPromise: isPromise,
        property: property,
        extend: extend,
        resolveValue: resolveValue
    };
};
