import * as spexLib from '../../typescript/spex';
import {IStreamReadResult} from '../../typescript/spex';

var spex = spexLib(Promise);

function cb() {

}

spex.stream.read(123, cb)
    .then((data: IStreamReadResult) => {
        var c: number = data.calls;
    })
    .catch((error: any) => {
    });
