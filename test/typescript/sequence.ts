import {sequence, errors, ISequenceResult, IArrayExt} from '../../typescript/spex';

function source() {

}

// default sequence:
sequence(source)
    .then((data: ISequenceResult | IArrayExt<any>) => {
        const actualData = <ISequenceResult>data;
        const d = actualData.duration;
        const t = actualData.total;
    })
    .catch((error: errors.SequenceError) => {
        const duration: number = error.duration;
    });

// sequence with tracking:
sequence(source, {track: true})
    .then((data: ISequenceResult | IArrayExt<any>) => {
        const actualData = <IArrayExt<any>>data;
        const r = actualData[0].anything;
    })
    .catch((error: errors.SequenceError) => {
        const msg: string = error.message;
    });
