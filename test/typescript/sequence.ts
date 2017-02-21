import * as spexLib from '../../typescript/spex';
import {TSequenceResult, IArrayExt} from '../../typescript/spex';

var spex = spexLib(Promise);

function source() {

}

type SequenceError = typeof spex.errors.SequenceError;

// default sequence:
spex.sequence(source)
    .then((data: TSequenceResult) => {
        var d = data.duration;
        var t = data.total;
    })
    .catch((error: SequenceError) => {
        var duration: number = error.duration;
    });

// sequence with tracking:
spex.sequence(source, {track: true})
    .then((data: IArrayExt<any>) => {
        var r = data[0].anything;
    })
    .catch((error: SequenceError) => {
        var msg: string = error.message;
    });
