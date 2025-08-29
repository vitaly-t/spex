import {errors, batch} from '../../typescript/spex';

batch<{ value: number }>([])
    .then(data => {
        const r = data[0].value;
        const d: number = data.duration;
    })
    .catch((error: errors.BatchError) => {
        const duration: number = error.stat.duration;
    });

(async function () {
    // must be able to deconstruct tuples:
    const [first, second] = await batch<number, number>([1, 2]);

    // must be able to access extended properties:
    const result = await batch<number>([1]);
    const d = result.duration;
})();
