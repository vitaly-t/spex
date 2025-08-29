const {isError, inspect} = require('./tools');
const {sequence, batch, errors} = require('../../src');

describe('Sequence - negative', () => {

    describe('with invalid parameters', () => {
        let error;
        beforeEach(done => {
            sequence()
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

        describe('as Error', () => {
            const err = new Error('source error');
            let r;
            beforeEach(done => {
                function source() {
                    throw err;
                }

                sequence(source)
                    .catch(e => {
                        r = e;
                        done();
                    });
            });

            it('must reject correctly', () => {
                expect(isError(r)).toBe(true);
                expect(r.name).toBe('SequenceError');
                expect(r instanceof Error).toBe(true);
                expect(r instanceof errors.SequenceError).toBe(true);
                expect(r.index).toBe(0);
                expect(r.error).toBe(err);
                expect('source' in r).toBe(true);
                expect(r.source).toBeUndefined();
                expect(inspect(r)).toContain('reason: Source \'source\' threw an error at index 0.');
            });
        });

        describe('with a string value', () => {
            const msg = 'source error';
            let r;
            beforeEach(done => {

                sequence(() => {
                    throw msg;
                })
                    .catch(e => {
                        r = e;
                        done();
                    });
            });

            it('must reject correctly', () => {
                expect(isError(r)).toBe(true);
                expect(r instanceof errors.SequenceError).toBe(true);
                expect(r.index).toBe(0);
                expect(r.message).toBe(msg);
                expect(r.error).toBe(msg);
                expect('source' in r).toBe(true);
                expect(r.source).toBeUndefined();
                expect(inspect(r)).toContain('reason: Source <anonymous> threw an error at index 0.');
            });
        });

        describe('with a non-string value', () => {
            let r;
            beforeEach(done => {

                sequence(() => {
                    throw 123;
                })
                    .catch(e => {
                        r = e;
                        done();
                    });
            });

            it('must reject correctly', () => {
                expect(isError(r, 'SequenceError')).toBe(true);
                expect(r.error).toBe(123);
                expect(r.message).toBe('123');
            });
        });

    });

    describe('source reject', () => {
        const msg = 'source reject';
        let error;
        beforeEach(done => {
            function source() {
                return Promise.reject(new Error(msg));
            }

            sequence(source)
                .catch(e => {
                    error = e;
                    done();
                });
        });

        it('must reject correctly', () => {
            expect(isError(error)).toBe(true);
            expect(error instanceof errors.SequenceError).toBe(true);
            expect(error.index).toBe(0);
            expect(error.message).toBe(msg);
            expect('source' in error).toBe(true);
            expect(error.source).toBeUndefined();
            expect(inspect(error)).toContain('reason: Source \'source\' returned a rejection at index 0.');
        });
    });

    describe('source reject with a batch', () => {

        let r;
        beforeEach(done => {

            function source() {
                return batch([Promise.reject(new Error('123'))]);
            }

            sequence(source)
                .catch(e => {
                    r = e;
                    done();
                });
        });

        it('must reject correctly', () => {
            expect(isError(r)).toBe(true);
            expect(r instanceof errors.SequenceError).toBe(true);
            expect(r.index).toBe(0);
            expect(r.message).toBe('123');
            expect('source' in r).toBe(true);
            expect(r.source).toBeUndefined();
            expect(inspect(r)).toContain('error: BatchError {');
        });
    });

    describe('destination error', () => {
        const msg = 'destination error';
        let error;
        beforeEach(done => {
            function source() {
                return 123;
            }

            function dest() {
                throw new Error(msg);
            }

            sequence(source, {dest})
                .catch(e => {
                    error = e;
                    done();
                });
        });

        it('must reject correctly', () => {
            expect(isError(error)).toBe(true);
            expect(error instanceof errors.SequenceError).toBe(true);
            expect(error.message).toBe(msg);
            expect(error.index).toBe(0);
            expect(error.dest).toBe(123);
            expect(inspect(error)).toContain('reason: Destination \'dest\' threw an error at index 0.');
        });
    });

    describe('destination reject', () => {
        const msg = 'destination reject';
        let r;
        beforeEach(done => {
            function source() {
                return 123;
            }

            function dest() {
                return Promise.reject(new Error(msg));
            }

            sequence(source, {dest})
                .catch(e => {
                    r = e;
                    done();
                });
        });
        it('must reject correctly', () => {
            expect(isError(r)).toBe(true);
            expect(r instanceof errors.SequenceError).toBe(true);
            expect(r.index).toBe(0);
            expect(r.message).toBe(msg);
            expect(r.dest).toBe(123);
            expect(inspect(r)).toContain('reason: Destination \'dest\' returned a rejection at index 0.');
            expect(inspect(r) !== r.toString(1)).toBe(true);
        });
    });

});

describe('Sequence - positive', () => {

    describe('with a limit', () => {
        const limit = 100;
        let result;

        function source() {
            return 123;
        }

        beforeEach(done => {
            sequence(source, {limit})
                .then(data => {
                    result = data;
                })
                .finally(() => {
                    done();
                });
        });
        it('must match the limit', () => {
            expect(result && typeof result === 'object').toBe(true);
            expect(result.total).toBe(limit);
            expect('duration' in result).toBe(true);
        });
    });

    describe('tracking', () => {
        const tracked = [];
        let result;

        function source(idx) {
            if (idx < 3) {
                return idx;
            }
        }

        function dest(idx, data) {
            tracked.push(data);
            if (idx) {
                return Promise.resolve();
            }
        }

        beforeEach(done => {
            sequence(source, {dest, track: true})
                .then(data => {
                    result = data;
                })
                .finally(() => {
                    done();
                });
        });
        it('must track and return the sequence', () => {
            expect(result instanceof Array).toBe(true);
            expect('duration' in result).toBe(true);
            expect(result).toEqual([0, 1, 2]);
            expect(result).toEqual(tracked);
        });
    });

    describe('this context', () => {
        const context = {};
        let ctx;

        function source() {
            ctx = this;
        }

        beforeEach(done => {
            sequence.call(context, source)
                .then(() => {
                    done();
                });
        });
        it('must be passed in correctly', () => {
            expect(ctx).toBe(context);
        });

    });

});

describe('Sequence callbacks generators', () => {
    const context = {};
    let result, ctx;

    function* source(index) {
        ctx = this;
        if (!index) {
            return yield Promise.resolve('src');
        }
    }

    function* dest(_, data) {
        this.data = data;
        return yield Promise.resolve('dest');
    }

    beforeEach(done => {
        sequence.call(context, source, {dest, track: true})
            .then(data => {
                result = data;
                done();
            });
    });
    it('must resolve successfully', () => {
        expect(result).toEqual(['src']);
        expect(ctx).toBe(context);
        expect(context.data).toBe('src');
    });
});
