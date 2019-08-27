import * as spexLib from '../../typescript/spex';
import {IStreamReadResult} from '../../typescript/spex';

const spex = spexLib(Promise);

function cb() {

}

spex.stream.read(123, cb)
    .then((data: IStreamReadResult) => {
        const c: number = data.calls;
    })
    .catch((error: any) => {
    });
