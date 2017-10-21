'use strict';

// All the promise libraries to run the tests against;
var libraries = {
    Native: Promise,
    Bluebird: require('bluebird'),
    Promise: require('Promise'),
    When: require('when'),
    Q: require('q'),
    RSVP: require('rsvp'),
    Lie: require('lie')
};

libraries.Bluebird.config({
    longStackTraces: false
});

var spex = require('../lib/index');

function run(test, name) {
    if (typeof test !== 'function') {
        throw new TypeError('Test callback function is required.');
    }
    console.log('*******************************');
    console.log('** TEST-START:', name);

    var libs = [];
    for (var i in libraries) {
        libs.push({
            name: i,
            lib: libraries[i]
        });
    }

    function loop(idx) {
        var l = libs[idx];
        test(spex(l.lib), l, function () {
            idx++;
            if (idx === libs.length) {
                console.log('** TEST-END:', name);
                console.log('*******************************');
            } else {
                loop(idx);
            }
        });
    }

    loop(0);
}

function numberFormat(num) {
    if (typeof num !== 'string') {
        num = num.toString();
    }
    return num.replace(/\B(?=(\d{3})+\b)/g, ',');
}

module.exports = {
    run: run,
    format: numberFormat
};
