const main = require('../lib/index');

describe('Main', () => {
    describe('protocol', () => {
        it('must contain all properties', () => {
            expect(main.batch instanceof Function).toBe(true);
            expect(main.page instanceof Function).toBe(true);
            expect(main.sequence instanceof Function).toBe(true);
            expect(main.stream && typeof main.stream === 'object').toBe(true);
            expect(main.stream.read instanceof Function).toBe(true);
            expect(main.errors && typeof main.errors === 'object').toBeTruthy();
            expect(main.errors.BatchError instanceof Function).toBe(true);
            expect(main.errors.PageError instanceof Function).toBe(true);
            expect(main.errors.SequenceError instanceof Function).toBe(true);
        });
    });
});
