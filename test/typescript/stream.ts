import * as spexLib from 'spex';

var spex = spexLib(Promise);

function cb() {

}

spex.stream.read(123, cb)
    .then((data: any) => {
        var c: number = data.calls;
    })
    .catch((error: any) => {
    });
