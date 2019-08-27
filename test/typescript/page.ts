import * as spexLib from '../../typescript/spex';
import {IPageResult} from '../../typescript/spex';

const spex = spexLib(Promise);

function source() {

}

type PageError = spexLib.errors.PageError;

spex.page(source)
    .then((data: IPageResult) => {
        const p: number = data.pages;
    })
    .catch((error: PageError) => {
        const duration: number = error.duration;
    });
