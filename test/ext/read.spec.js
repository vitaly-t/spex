const fs = require('fs');
const lib = require('../header');
const promise = lib.promise;
const spex = lib.main(promise);

describe('Stream/Read - negative', () => {

    let stm;
    beforeEach(() => {
        stm = fs.createReadStream(__filename);
    });

    afterEach(() => {
        stm.destroy();
    });

    describe('invalid parameters', () => {

        describe(' - stream', () => {
            let error;
            beforeEach(done => {
                spex.stream.read(null)
                    .catch(e => {
                        error = e;
                        done();
                    });
            });
            it('must reject', () => {
                expect(error instanceof TypeError).toBe(true);
                expect(error.message).toBe('Readable stream is required.');
            });
        });

        describe(' - receiver', () => {
            let error;
            beforeEach(done => {
                spex.stream.read(stm)
                    .catch(e => {
                        error = e;
                        done();
                    });
            });
            it('must reject', () => {
                expect(error instanceof TypeError).toBe(true);
                expect(error.message).toBe('Invalid stream receiver.');
            });
        });

    });

    describe('error event', () => {
        let error;
        beforeEach(done => {
            function receiver() {
                stm.emit('error', new Error('Ops!'));
            }

            spex.stream.read(stm, receiver)
                .catch(err => {
                    error = err;
                    done();
                });
        });
        it('must reject with the right error', () => {
            expect(error instanceof Error).toBe(true);
            expect(error.message).toBe('Ops!');
        });
    });

    describe('receiver rejecting', () => {
        const err = new Error('stop');
        let error;
        beforeEach(done => {
            function receiver() {
                return promise.reject(err);
            }

            spex.stream.read(stm, receiver)
                .catch(e => {
                    error = e;
                    done();
                });
        });
        it('must reject with the right error', () => {
            expect(error).toBe(err);
        });
    });

    describe('receiver throwing an error', () => {
        let error;
        beforeEach(done => {
            function receiver() {
                throw new Error('stop');
            }

            spex.stream.read(stm, receiver)
                .catch(err => {
                    error = err;
                    done();
                });
        });
        it('must reject with the right error', () => {
            expect(error instanceof Error).toBe(true);
            expect(error.message).toBe('stop');
        });
    });

});

describe('Stream/Read - positive', () => {

    let stm;

    beforeEach(() => {
        stm = fs.createReadStream(__filename, {encoding: 'utf8'});
    });

    afterEach(() => {
        stm.destroy();
    });

    describe('End-stream, returning promises', () => {
        let result;
        beforeEach(done => {
            spex.stream.read(stm, receiver)
                .then(data => {
                    result = data;
                    done();
                });

            function receiver() {
                return promise.resolve();
            }
        });
        it('must resolve with full statistics', () => {
            testStat(result);
        });
    });

    describe('Close-stream with empty receiver', () => {
        let result;
        beforeEach(done => {
            spex.stream.read(stm, receiver, {closable: true})
                .then(data => {
                    result = data;
                    done();
                });

            function receiver() {
                return promise.resolve();
            }
        });
        it('must resolve with full statistics', () => {
            testStat(result);
        });
    });

    function testStat(obj) {
        expect(obj && typeof obj === 'object').toBe(true);
        expect(obj.reads > 0).toBe(true);
        expect(obj.calls > 0).toBe(true);
        expect(obj.reads >= obj.calls).toBe(true);
        expect(obj.length > 0).toBe(true);
        expect(obj.duration >= 0).toBe(true);
    }

    describe('Reduced readSize', () => {
        let r;
        beforeEach(done => {
            spex.stream.read(stm, receiver, {readSize: 100})
                .then(() => {
                    done();
                });

            function receiver(index, data, delay) {
                r = {
                    index: index,
                    data: data,
                    delay: delay
                };
            }
        });

        it('must provide a delay', () => {
            expect(r && typeof r === 'object').toBe(true);
            expect(r.index > 0).toBe(true);
            expect(r.data).toBeTruthy();
            expect(r.delay >= 0).toBe(true);
        });
    });

    describe('chunk read', () => {
        let result;
        beforeEach(done => {
            spex.stream.read(stm, receiver, {readChunks: true})
                .then(() => {
                    done();
                });

            function receiver(index, data) {
                result = data;
            }
        });
        it('must receive all the data', () => {
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(1);
            expect(result[0].length).toBeGreaterThan(500);
        });
    });
});

describe('Stream.read', () => {

    let stm;

    beforeEach(() => {
        stm = fs.createReadStream(__filename);
    });

    afterEach(() => {
        // stm.destroy();
    });

    describe('this with generator', () => {
        const context = {};
        let result, ctx;

        function* receiver() {
            ctx = this;
            return yield 'ok';
        }

        beforeEach(done => {
            // NOTE: For some reasons, without setting readSize bigger than this stream file,
            // it would fail specifically under NodeJS v4 and v15 :)
            spex.stream.read.call(context, stm, receiver, {readSize: 15000})
                .then(data => {
                    result = data;
                    done();
                });
        });

        it('must resolve with full statistics', () => {
            expect(ctx).toBe(context);
            expect(result && typeof result === 'object').toBeTruthy();
            expect(result.calls).toBe(1);
            expect(result.reads).toBe(1);
            expect('length' in result).toBeTruthy();
            expect('duration' in result).toBeTruthy();
        });
    });

});
