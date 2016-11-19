import * as spexLib from '../../typescript/spex';
import {TStreamReadResult} from '../../typescript/spex';

var spex = spexLib(Promise);

function cb() {

}

spex.stream.read(123, cb)
    .then((data: TStreamReadResult) => {
        var c: number = data.calls;
    })
    .catch((error: any) => {
    });
