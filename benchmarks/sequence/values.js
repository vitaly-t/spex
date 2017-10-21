'use strict';

var $test = require('../test');

var $spex, // spex library instance;
    $lib; // name of the promise library;

function source(idx) {
    return idx;
}

function run(size, done) {
    $spex.sequence(source, {limit: size})
        .then(function (data) {
            console.log($lib.name + '(' + $test.format(size) + '): ' + data.duration);
            setTimeout(function () {
                done();
            }, 100);
        });
}

function runAll(spex, lib, done) {
    $spex = spex;
    $lib = lib;

    var sizes = [10, 100, 1000, 10000, 100000, 1000000];

    function loop(idx) {
        run(sizes[idx], function () {
            idx++;
            if (idx < sizes.length) {
                loop(idx);
            } else {
                done();
            }
        });
    }

    loop(0);
}

$test.run(runAll, 'Sequence Values');
