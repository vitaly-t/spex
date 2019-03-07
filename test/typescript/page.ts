import * as spexLib from '../../typescript/spex';
import {TPageResult} from '../../typescript/spex';

var spex = spexLib(Promise);

function source() {

}

type PageError = spexLib.errors.PageError;

spex.page(source)
    .then((data: TPageResult) => {
        var p: number = data.pages;
    })
    .catch((error: PageError) => {
        var duration: number = error.duration;
    });
