const lib = require('../header');
const tools = require('../tools');

const promise = lib.promise;
const spex = lib.main(promise);

const isError = lib.isError;

describe('Batch - negative', () => {

    describe('with invalid parameters', () => {
        let error;
        beforeEach(done => {
            spex.batch()
                .catch(e => {
                    error = e;
                    done();
                });
        });
        it('must reject an invalid array of values', () => {
            expect(isError(error)).toBe(true);
            expect(error instanceof TypeError).toBe(true);
            expect(error.message).toBe('Method \'batch\' requires an array of values.');
        });
    });

    describe('callback error', () => {

        describe('passing success', () => {
            const err = new Error('callback error');
            let r;
            beforeEach(done => {

                function cb() {
                    throw err;
                }

                spex.batch([1], {cb: cb})
                    .catch(reason => {
                        r = reason;
                        done();
                    });

            });
            it('must reject correctly', () => {
                expect(isError(r)).toBe(true);
                expect(r.data).toEqual([{
                    success: false,
                    result: err,
                    origin: {success: true, result: 1}
                }]);
                expect(r.getErrors()).toEqual([err]);
            });
        });

        describe('passing error', () => {
            const err = new Error('callback error'), rejectError = new Error('ops!');
            let r;
            beforeEach(done => {

                function cb() {
                    throw err;
                }

                spex.batch([promise.reject(rejectError)], {cb: cb})
                    .catch(reason => {
                        r = reason;
                        done();
                    });
            });
            it('must reject correctly', () => {
                expect(isError(r)).toBe(true);
                expect(r.data).toEqual([{
                    success: false,
                    result: err,
                    origin: {success: false, result: rejectError}
                }]);
                expect(r.getErrors()).toEqual([err]);
            });
        });

    });

    describe('callback reject', () => {
        const err = new Error('callback reject');
        let r;
        beforeEach(done => {

            function cb(index) {
                if (index) {
                    return promise.resolve();
                }
                return promise.reject(err);
            }

            spex.batch([1, 2], {cb: cb})
                .catch(reason => {
                    r = reason;
                    done();
                });

        });

        it('must reject correctly', () => {
            expect(isError(r)).toBe(true);
            expect(r.data).toEqual([
                {
                    success: false,
                    result: err,
                    origin: {success: true, result: 1}
                },
                {
                    success: true,
                    result: 2
                }]);
            expect(r.getErrors()).toEqual([err]);
        });
    });

    describe('input reject', () => {
        const err = new Error('no values');
        let r;

        function value() {
            throw err;
        }

        beforeEach(done => {
            spex.batch([value])
                .catch(reason => {
                    r = reason;
                    done();
                });
        });
        it('must reject correctly', () => {
            expect(isError(r)).toBe(true);
            expect(r.data).toEqual([
                {
                    success: false,
                    result: err
                }
            ]);
            expect(r.first).toEqual(err);
        });
    });

    describe('input: null reject', () => {
        const err = new Error(null);
        let r;

        function value() {
            throw err;
        }

        beforeEach(done => {
            spex.batch([value])
                .catch(reason => {
                    r = reason;
                    done();
                });
        });
        it('must reject correctly', () => {
            expect(isError(r)).toBe(true);
            expect(r.data).toEqual([
                {
                    success: false,
                    result: err
                }
            ]);
            expect(r.first).toBe(err);
            expect(r.message).toBe('null');
        });
    });

    describe('input: simple reject', () => {
        const err = new Error(123);
        let r;

        function value() {
            throw err;
        }

        beforeEach(done => {
            spex.batch([value])
                .catch(reason => {
                    r = reason;
                    done();
                });
        });

        it('must reject correctly', () => {
            expect(isError(r)).toBe(true);
            expect(r.data).toEqual([
                {
                    success: false,
                    result: err
                }
            ]);
            expect(r.first).toBe(err);
            expect(r.message).toBe('123');
        });
    });

    describe('nested batch reject', () => {

        describe('with error', () => {
            const err = new Error('internal failure');
            let error;

            function problem() {
                throw err;
            }

            function value() {
                return spex.batch([problem]);
            }

            beforeEach(done => {
                spex.batch([value])
                    .catch(reason => {
                        error = reason;
                        done();
                    });
            });
            it('must be reported correctly', () => {
                expect(isError(error)).toBe(true);
                expect(error.first).toEqual(err);
                expect(error.getErrors()).toEqual([[err]]);
                expect(error.message).toBe(err.message);
            });
        });

        describe('with value', () => {
            const err = 'internal failure';
            let error;

            function problem() {
                throw err;
            }

            function value() {
                return spex.batch([problem]);
            }

            beforeEach(done => {
                spex.batch([value])
                    .catch(reason => {
                        error = reason;
                        done();
                    });
            });

            it('must be reported correctly', () => {
                expect(isError(error)).toBe(true);
                expect(error.first).toEqual(err);
                expect(error.getErrors()).toEqual([[err]]);
                expect(error.message).toBe(err);
                expect(tools.inspect(error)).toContain('stat: { total: 1, succeeded: 0, failed: 1, duration:');
            });
        });

    });
});

describe('Batch - positive', () => {

    describe('empty input', () => {
        let result;
        beforeEach(done => {
            spex.batch([])
                .then(data => {
                    result = data;
                    done();
                });
        });
        it('must resolve with an empty result', () => {
            expect(result).toEqual([]);
            expect(typeof result.duration).toBe('number');
        });
    });

    describe('this context', () => {
        const context = {};
        let ctx;

        function test() {
            ctx = this;
        }

        beforeEach(done => {
            spex.batch.call(context, [test])
                .then(() => {
                    done();
                });
        });

        it('must be passed in correctly', () => {
            expect(ctx).toBe(context);
        });

    });

});

describe('Batch callback as generator', () => {
    const context = {};
    let result, ctx;

    function* cb() {
        ctx = this;
        return yield promise.resolve('yes');
    }

    beforeEach(done => {
        spex.batch.call(context, [1], {cb: cb})
            .then(data => {
                result = data;
                done();
            });
    });
    it('must resolve successfully', () => {
        expect(result).toEqual([1]);
        expect(ctx).toBe(context);
    });
});
