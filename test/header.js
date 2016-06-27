/////////////////////////////////////
// Library header used in every test;
/////////////////////////////////////

'use strict';

var util = require('util');

function isError(e, name) {
    var confirmed = e instanceof Error &&
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
            console.error("ERROR: Not an Error instance.");
        }
        if (typeof e.message !== 'string') {
            console.error("ERROR: Message is a not a string:", e.message);
        }
        if (typeof e.stack !== 'string') {
            console.error("ERROR: Stack is a not a string:", e.stack);
        }
    }

    return confirmed;
}

module.exports = {
    promise: require('bluebird'), // test promise library;
    main: require('../lib/index'),
    isError: isError
};
