import * as spexLib from 'spex';

var spex = spexLib(Promise);

function source() {

}

spex.page(source)
    .then((data: any) => {
        var p: number = data.pages;
    })
    .catch((error: any) => {
        var e = <typeof spex.errors.PageError>error;
        var duration: number = e.duration;
    });
