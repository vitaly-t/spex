import * as spexLib from 'spex'

var spex = spexLib(Promise);

function source() {

}

spex.sequence(source)
    .then((data: any) => {
        var r = data[0].anything;
    })
    .catch((error: any) => {
        var e = <typeof spex.errors.SequenceError>error;
        var duration: number = e.duration;
    });
