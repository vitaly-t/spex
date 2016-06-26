/// <reference path='../../typescript/spex' />

import * as spexLib from 'spex';

var spex = spexLib(Promise);

function source() {

}

spex.page(source)
    .then(data=> {
        var p:number = data.pages;
    })
    .catch(error=> {
        var e = <typeof spex.errors.PageError>error;
        var duration:number = e.duration;
    });
