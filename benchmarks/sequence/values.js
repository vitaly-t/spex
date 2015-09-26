var $test = require("../test");

var $spex, // spex library instance;
    $lib, // name of the promise library;
    $p; // promise library;

function source(idx) {
    return idx;
}

function run(size, done) {
    $spex.sequence(source, null, size)
        .then(function (data) {
            console.log($lib.name + "(" + $test.format(size) + "): " + data.duration);
            setTimeout(function () {
                done();
            }, 100);
        });
}

function run_all(spex, lib, done) {
    $spex = spex;
    $lib = lib;
    $p = spex.$p;
    var sizes = [10, 100, 1000, 10000, 100000, 1000000, 10000000];

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

$test.run(run_all, "Sequence Values");
