import * as spexLib from '../../typescript/spex';

const spex = spexLib(Promise);

type BatchError = spexLib.errors.BatchError;

spex.batch<{ value: number }>([])
    .then(data => {
        const r = data[0].value;
        const d: number = data.duration;
    })
    .catch((error: BatchError) => {
        const duration: number = error.stat.duration;
    });

(async function () {
    // must be able to deconstruct tuples:
    const [first, second] = await spex.batch<number, number>([1, 2]);

    // must be able to access extended properties:
    const result = await spex.batch<number>([1]);
    const d = result.duration;
})();
