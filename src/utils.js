const npm = {
    stream: require('stream'),
    util: require('util')
};

//////////////////////////////////////////
// Checks if the function is a generator,
// and if so - wraps it up into a promise;
function wrap(func) {
    if (typeof func === 'function') {
        if (func.constructor.name === 'GeneratorFunction') {
            return asyncAdapter(func);
        }
        return func;
    }
    return null;
}

/////////////////////////////////////////////////////
// Resolves a mixed value into the actual value,
// consistent with the way mixed values are defined:
// https://github.com/vitaly-t/spex/wiki/Mixed-Values
function resolve(value, params, onSuccess, onError) {

    const self = this;
    let delayed = false;

    function loop() {
        while (typeof value === 'function') {
            if (value.constructor.name === 'GeneratorFunction') {
                value = asyncAdapter(value);
            }
            try {
                value = params ? value.apply(self, params) : value.call(self);
            } catch (e) {
                onError(e, false); // false means 'threw an error'
                return;
            }
        }
        if (value instanceof Promise) {
            value
                .then(data => {
                    delayed = true;
                    value = data;
                    loop();
                })
                .catch(error => {
                    onError(error, true); // true means 'rejected'
                });
        } else {
            onSuccess(value, delayed);
        }
    }

    loop();
}

// Generator-to-Promise adapter;
// Based on: https://www.promisejs.org/generators/#both
function asyncAdapter(generator) {
    return function () {
        const g = generator.apply(this, arguments);

        function handle(result) {
            if (result.done) {
                return Promise.resolve(result.value);
            }
            return Promise.resolve(result.value)
                .then(res => handle(g.next(res)), err => handle(g.throw(err)));
        }

        return handle(g.next());
    };
}

////////////////////////////////////////////
// Checks object for being a readable stream;
function isReadableStream(obj) {
    return obj instanceof npm.stream.Stream &&
        typeof obj._read === 'function' &&
        typeof obj._readableState === 'object';
}

////////////////////////////////////////////////////////////
// Sets an object property as read-only and non-enumerable.
function extend(obj, name, value) {
    Object.defineProperty(obj, name, {
        value,
        configurable: false,
        enumerable: false,
        writable: false
    });
}

///////////////////////////////////////////
// Returns a space gap for console output;
function messageGap(level) {
    return ' '.repeat(level * 4);
}

function formatError(error, level) {
    const names = ['BatchError', 'PageError', 'SequenceError'];
    let msg = npm.util.inspect(error);
    if (error instanceof Error) {
        if (names.indexOf(error.name) === -1) {
            const gap = messageGap(level);
            msg = msg.split('\n').map((line, index) => {
                return (index ? gap : '') + line;
            }).join('\n');
        } else {
            msg = error.toString(level);
        }
    }
    return msg;
}

////////////////////////////////////////////////////////
// Adds prototype inspection, with support of the newer
// Custom Inspection, which was added in Node.js 6.x
function addInspection(type, cb) {
    // istanbul ignore next;
    if (npm.util.inspect.custom) {
        // Custom inspection is supported:
        type.prototype[npm.util.inspect.custom] = cb;
    } else {
        // Use the classic inspection:
        type.prototype.inspect = cb;
    }
}

module.exports = {
    formatError,
    isReadableStream,
    messageGap,
    extend,
    resolve,
    wrap,
    addInspection
};
