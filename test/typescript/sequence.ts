/// <reference path='../../typescript/spex' />

import * as spexLib from 'spex';

var spex = spexLib(Promise);

function source() {

}

spex.sequence(source)
    .then(data=> {
        var r = data[0].anything;
    })
    .catch(error=> {
        var e = <typeof spex.errors.SequenceError>error;
        var duration:number = e.duration;
    });
