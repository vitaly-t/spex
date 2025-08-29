const {
    batch,
    page,
    sequence,
    stream,
    errors
} = require('../src');

describe('main', () => {
    describe('protocol', () => {
        it('must contain all properties', () => {
            expect(batch instanceof Function).toBe(true);
            expect(page instanceof Function).toBe(true);
            expect(sequence instanceof Function).toBe(true);
            expect(stream && typeof stream === 'object').toBe(true);
            expect(stream.read instanceof Function).toBe(true);
            expect(errors && typeof errors === 'object').toBeTruthy();
            expect(errors.BatchError instanceof Function).toBe(true);
            expect(errors.PageError instanceof Function).toBe(true);
            expect(errors.SequenceError instanceof Function).toBe(true);
        });
    });
});
