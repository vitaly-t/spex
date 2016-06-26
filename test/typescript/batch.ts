/// <reference path='../../typescript/spex' />

import * as spexLib from 'spex';

var spex = spexLib(Promise);

spex.batch([])
    .then(data=> {
        var r = data[0].anything;
    })
    .catch(error=> {
        var e = <typeof spex.errors.BatchError>error;
        var duration:number = e.stat.duration;
    });
