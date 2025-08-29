import {page, errors, IPageResult} from '../../typescript/spex';

function source() {

}

page(source)
    .then((data: IPageResult) => {
        const p: number = data.pages;
    })
    .catch((error: errors.PageError) => {
        const duration: number = error.duration;
    });
