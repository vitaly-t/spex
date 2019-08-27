import * as spexLib from '../../typescript/spex';
import {IArrayExt} from '../../typescript/spex';

const spex = spexLib(Promise);

type BatchError = spexLib.errors.BatchError;

spex.batch([])
    .then((data: IArrayExt<any>) => {
        const r = data[0].anything;
        const d: number = data.duration;
    })
    .catch((error: BatchError) => {
        const duration: number = error.stat.duration;
    });
