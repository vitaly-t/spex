import * as spexLib from '../../typescript/spex';

var spex = spexLib(Promise);

type BatchError = typeof spex.errors.BatchError;

spex.batch([])
    .then((data: Array<any>) => {
        var r = data[0].anything;
    })
    .catch((error: BatchError) => {
        var duration: number = error.stat.duration;
    });
