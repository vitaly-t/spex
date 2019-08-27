const $test = require('../test');

let $spex, // spex library instance;
    $lib, // name of the promise library;
    $p; // promise library;

function source(idx) {
    return $p.resolve(idx);
}

function run(size, done) {
    $spex.sequence(source, {limit: size})
        .then(data => {
            console.log($lib.name + '(' + $test.format(size) + '): ' + data.duration);
            setTimeout(() => {
                done();
            }, 100);
        });
}

function runAll(spex, lib, done) {
    $spex = spex;
    $lib = lib;
    $p = spex.$p;
    const sizes = [10, 100, 1000, 10000, 100000, 1000000];

    function loop(idx) {
        run(sizes[idx], () => {
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

$test.run(runAll, 'Sequence Promises');
