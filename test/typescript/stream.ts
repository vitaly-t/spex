import {stream, IStreamReadResult} from '../../typescript/spex';

function cb() {

}

stream.read(123, cb)
    .then((data: IStreamReadResult) => {
        const c: number = data.calls;
    })
    .catch((error: any) => {
    });
