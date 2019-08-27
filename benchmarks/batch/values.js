const $test = require('../test');

let $spex, // spex library instance;
    $lib; // name of the promise library;

function run(size, done) {
    const data = [];
    for (let i = 0; i < size; i++) {
        data.push(i);
    }
    $spex.batch(data)
        .then(d => {
            console.log($lib.name + '(' + $test.format(size) + '): ' + d.duration);
            setTimeout(() => {
                done();
            }, 100);
        });
}

function runAll(spex, lib, done) {
    $spex = spex;
    $lib = lib;
    const sizes = [10, 100, 1000, 10000, 100000, 1000000, 10000000];

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

$test.run(runAll, 'Batch Values');
