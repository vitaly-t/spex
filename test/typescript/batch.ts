import * as spexLib from '../../typescript/spex';
import {IArrayExt} from '../../typescript/spex';

var spex = spexLib(Promise);

type BatchError = typeof spex.errors.BatchError;

spex.batch([])
    .then((data: IArrayExt<any>) => {
        var r = data[0].anything;
        var d: number = data.duration;
    })
    .catch((error: BatchError) => {
        var duration: number = error.stat.duration;
    });
