const util = require('util');

function isError(e, name) {
    let confirmed = e instanceof Error &&
        typeof e === 'object' &&
        typeof e.message === 'string' &&
        typeof e.stack === 'string';

    if (name === undefined) {
        confirmed = confirmed && typeof e.name === 'string';
    } else {
        confirmed = confirmed && e.name === name;
    }

    if (!confirmed) {
        if (!(e instanceof Error)) {
            console.error('ERROR: Not an Error instance.'); // eslint-disable-line no-console
        }
        if (typeof e.message !== 'string') {
            console.error('ERROR: Message is a not a string:', e.message); // eslint-disable-line no-console
        }
        if (typeof e.stack !== 'string') {
            console.error('ERROR: Stack is a not a string:', e.stack); // eslint-disable-line no-console
        }
    }

    return confirmed;
}

function inspect(obj) {
    if (util.inspect.custom) {
        return obj[util.inspect.custom]();
    }
    return obj.inspect();
}

module.exports = {isError, inspect};
