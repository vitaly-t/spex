import * as spexLib from 'spex';

var spex = spexLib(Promise);

spex.batch([])
    .then((data: Array<any>) => {
        var r = data[0].anything;
    })
    .catch((error: typeof spex.errors.BatchError) => {
        var duration: number = error.stat.duration;
    });
