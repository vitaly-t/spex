import * as spexLib from '../../typescript/spex';
import {ISequenceResult, IArrayExt} from '../../typescript/spex';

var spex = spexLib(Promise);

function source() {

}

type SequenceError = spexLib.errors.SequenceError;

// default sequence:
spex.sequence(source)
    .then((data: ISequenceResult | IArrayExt<any>) => {
        const actualData = <ISequenceResult>data;
        var d = actualData.duration;
        var t = actualData.total;
    })
    .catch((error: SequenceError) => {
        var duration: number = error.duration;
    });

// sequence with tracking:
spex.sequence(source, {track: true})
    .then((data: ISequenceResult | IArrayExt<any>) => {
        const actualData = <IArrayExt<any>>data;
        var r = actualData[0].anything;
    })
    .catch((error: SequenceError) => {
        var msg: string = error.message;
    });
