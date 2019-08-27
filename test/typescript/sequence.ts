import * as spexLib from '../../typescript/spex';
import {ISequenceResult, IArrayExt} from '../../typescript/spex';

const spex = spexLib(Promise);

function source() {

}

type SequenceError = spexLib.errors.SequenceError;

// default sequence:
spex.sequence(source)
    .then((data: ISequenceResult | IArrayExt<any>) => {
        const actualData = <ISequenceResult>data;
        const d = actualData.duration;
        const t = actualData.total;
    })
    .catch((error: SequenceError) => {
        const duration: number = error.duration;
    });

// sequence with tracking:
spex.sequence(source, {track: true})
    .then((data: ISequenceResult | IArrayExt<any>) => {
        const actualData = <IArrayExt<any>>data;
        const r = actualData[0].anything;
    })
    .catch((error: SequenceError) => {
        const msg: string = error.message;
    });
