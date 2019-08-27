const lib = require('../header');
const tools = require('../tools');

const promise = lib.promise;
const spex = lib.main(promise);

const isError = lib.isError;
const {PageError} = require('../../lib/errors/page');
const {BatchError} = require('../../lib/errors/batch');

describe('Page - negative', () => {

    describe('with invalid parameters', () => {
        let error;
        beforeEach(done => {
            spex.page()
                .catch(e => {
                    error = e;
                    done();
                });
        });
        it('must reject an invalid source function', () => {
            expect(isError(error)).toBe(true);
            expect(error instanceof TypeError).toBe(true);
            expect(error.message).toBe('Parameter \'source\' must be a function.');
        });
    });

    describe('source error', () => {

        describe('with Error', () => {
            const err = new Error('source error');
            let r;

            beforeEach(done => {
                function source() {
                    throw err;
                }

                spex.page(source)
                    .catch(reason => {
                        r = reason;
                        done();
                    });
            });

            it('must reject correctly', () => {
                expect(isError(r)).toBe(true);
                expect(r instanceof Error).toBe(true);
                expect(r instanceof PageError).toBe(true);
                expect(r.name).toBe('PageError');
                expect(r.index).toBe(0);
                expect(r.error).toBe(err);
                expect('source' in r).toBe(true);
                expect(r.source).toBeUndefined();
                expect('dest' in r).toBe(false);
                expect(tools.inspect(r)).toContain('reason: Source \'source\' threw an error at index 0.');
            });
        });

        describe('with a string value', () => {
            const err = 'source error';
            let r;

            beforeEach(done => {

                spex.page(() => {
                    throw err;
                })
                    .catch(reason => {
                        r = reason;
                        done();
                    });
            });

            it('must reject correctly', () => {
                expect(isError(r)).toBe(true);
                expect(r instanceof PageError).toBe(true);
                expect(r.index).toBe(0);
                expect(r.error).toBe(err);
                expect('source' in r).toBe(true);
                expect(r.source).toBeUndefined();
                expect('dest' in r).toBe(false);
                expect(tools.inspect(r)).toContain('reason: Source <anonymous> threw an error at index 0.');
            });
        });

        describe('with a non-string value', () => {
            const err = 123;
            let r;

            beforeEach(done => {

                spex.page(() => {
                    throw err;
                })
                    .catch(reason => {
                        r = reason;
                        done();
                    });
            });

            it('must reject correctly', () => {
                expect(isError(r, 'PageError')).toBe(true);
                expect(r.error).toBe(err);
                expect(r.message).toBe('123');
            });
        });

    });

    describe('source reject', () => {
        const err = new Error('source reject');
        let r;

        beforeEach(done => {
            function source() {
                return promise.reject(err);
            }

            spex.page(source)
                .catch(reason => {
                    r = reason;
                    done();
                });

        });

        it('must reject correctly', () => {
            expect(isError(r)).toBe(true);
            expect(r instanceof PageError);
            expect(r.index).toBe(0);
            expect(r.error).toBe(err);
            expect('source' in r).toBe(true);
            expect(r.source).toBeUndefined();
            expect(tools.inspect(r)).toContain('reason: Source \'source\' returned a rejection at index 0.');
        });
    });

    describe('destination error', () => {
        const err = new Error('destination error');
        let r;
        beforeEach(done => {
            function source() {
                return [1, 2, 3];
            }

            function dest() {
                throw err;
            }

            spex.page(source, {dest: dest})
                .catch(reason => {
                    r = reason;
                    done();
                });
        });

        it('must reject correctly', () => {
            expect(isError(r)).toBe(true);
            expect(r instanceof PageError).toBe(true);
            expect(r.index).toBe(0);
            expect(r.error).toBe(err);
            expect(r.dest).toEqual([1, 2, 3]);
            expect(tools.inspect(r)).toContain('reason: Destination \'dest\' threw an error at index 0.');
        });
    });

    describe('destination reject', () => {
        const err = new Error('destination reject');
        let r;
        beforeEach(done => {
            function source() {
                return [1, 2, 3];
            }

            function dest() {
                return promise.reject(err);
            }

            spex.page(source, {dest: dest})
                .catch(reason => {
                    r = reason;
                    done();
                });
        });

        it('must reject correctly', () => {
            expect(isError(r)).toBe(true);
            expect(r instanceof PageError).toBe(true);
            expect(r.index).toBe(0);
            expect(r.error).toBe(err);
            expect(r.dest).toEqual([1, 2, 3]);
            expect(tools.inspect(r)).toContain('reason: Destination \'dest\' returned a rejection at index 0.');
            expect(tools.inspect(r) !== r.toString(1)).toBe(true);
        });
    });

    describe('page returns wrong value', () => {
        const msg = 'Unexpected data returned from the source.';
        let r;

        function source(idx) {
            if (!idx) {
                return [1, promise.resolve(2), 3];
            }
            return 123;
        }

        beforeEach(done => {
            spex.page(source)
                .catch(reason => {
                    r = reason;
                    done();
                });
        });

        it('must reject correctly', () => {
            expect(isError(r)).toBe(true);
            expect(r instanceof PageError).toBe(true);
            expect(r.index).toBe(1);
            expect(r.error instanceof Error).toBe(true);
            expect(r.message).toBe(msg);
            expect(r.source).toEqual([1, 2, 3]);
            expect(tools.inspect(r)).toContain('reason: Source \'source\' returned a non-array value at index 1.');
        });
    });

    describe('page data fail', () => {
        const err = new Error('second');
        let error;

        function source(idx) {
            if (idx > 1) {
                return [1, promise.reject(err), 3];
            }
            return [];
        }

        beforeEach(done => {
            spex.page(source, {})
                .catch(reason => {
                    error = reason;
                    done();
                });
        });

        it('must reject correctly', () => {
            expect(error.index).toBe(2);
            expect(error.error instanceof Error).toBeTruthy();
            expect(error.error instanceof BatchError).toBeTruthy();
            expect(error.error.name).toBe('BatchError');
            expect(error.error.data).toEqual([
                {
                    success: true,
                    result: 1
                },
                {
                    success: false,
                    result: err
                },
                {
                    success: true,
                    result: 3
                }
            ]);
            expect(isError(error)).toBe(true);
            expect(error.message).toBe('second');
            expect(tools.inspect(error)).toContain('reason: Page with index 2 rejected.');
        });
    });

});

describe('Page - positive', () => {

    describe('with mixed data types', () => {
        const tracking = [];
        let result;

        function val() {
            return spex.batch(['one']);
        }

        function source(idx) {
            switch (idx) {
                case 0:
                    return [1, promise.resolve(2), 3];
                case 1:
                    return [];
                case 2:
                    return [undefined, promise.resolve(), true, val];
                default:
                    break;
            }
        }

        function dest(idx, data) {
            tracking.push(data);
            if (!idx) {
                return promise.resolve();
            }
        }

        beforeEach(done => {
            spex.page(source, {dest: dest})
                .then(data => {
                    result = data;
                    done();
                });
        });

        it('must return all the data', () => {
            expect(result && typeof result === 'object').toBe(true);
            expect(result.pages).toBe(3);
            expect(result.total).toBe(7);
            expect(typeof result.duration).toBe('number');
            expect(tracking).toEqual([
                [1, 2, 3], [], [undefined, undefined, true, ['one']]
            ]);
        });
    });

    describe('reaching limit', () => {
        const limit = 100;
        let result;

        function source(idx) {
            return [1, idx, 'last'];
        }

        beforeEach(done => {
            spex.page(source, {limit: limit})
                .then(data => {
                    result = data;
                    done();
                });
        });

        it('must resolve correctly', () => {
            expect(result && typeof result === 'object').toBe(true);
            expect(result.pages).toBe(limit);
            expect(result.total).toBe(limit * 3);
            expect('duration' in result).toBe(true);
        });
    });

    describe('this context', () => {
        const context = {};
        let ctx;

        function source() {
            ctx = this;
        }

        beforeEach(done => {
            spex.page.call(context, source)
                .then(() => {
                    done();
                });
        });
        it('must be passed in correctly', () => {
            expect(ctx).toBe(context);
        });

    });

});

describe('Page callbacks generators', () => {
    const context = {};
    let result, ctx;

    function* source() {
        ctx = this;
        return yield promise.resolve(['src']);
    }

    function* dest(_, data) {
        this.data = data;
        return yield promise.resolve('dest');
    }

    beforeEach(done => {
        spex.page.call(context, source, {dest: dest, limit: 1})
            .then(data => {
                result = data;
                done();
            });
    });
    it('must resolve successfully', () => {
        expect(result.pages).toBe(1);
        expect(result.total).toBe(1);
        expect(ctx).toBe(context);
        expect(context.data).toEqual(['src']);
    });
});
