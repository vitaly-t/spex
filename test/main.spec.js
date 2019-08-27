const lib = require('./header');
const promise = lib.promise;
const spex = lib.main(promise);
const PromiseAdapter = lib.main.PromiseAdapter;

const dummy = () => {
};

describe('Main - negative', () => {

    describe('passing invalid promise', () => {
        const error = 'Invalid promise library specified.';

        describe('as nothing', () => {
            it('must throw an error', () => {
                expect(() => {
                    lib.main();
                })
                    .toThrow(error);
            });
        });

        describe('as a wrong type', () => {
            it('must throw an error', () => {
                expect(() => {
                    lib.main(123);
                }).toThrow(error);
            });
        });

        describe('as a dummy function', () => {
            it('must throw an error', () => {
                expect(() => {
                    lib.main(dummy);
                })
                    .toThrow(error);
            });
        });

    });

    describe('passing invalid adapter', () => {
        it('must throw an error', () => {
            expect(() => {
                new PromiseAdapter();
            }).toThrow('Adapter requires a function to create a promise.');
            expect(() => {
                new PromiseAdapter(dummy);
            }).toThrow('Adapter requires a function to resolve a promise.');
            expect(() => {
                new PromiseAdapter(dummy, dummy);
            }).toThrow('Adapter requires a function to reject a promise.');
        });
    });
});

describe('Main - positive', () => {

    describe('protocol', () => {
        let inst;
        beforeEach(() => {
            inst = lib.main(promise);
        });
        it('must contain all pre-initialization properties', () => {
            expect(lib.main.errors).toBe(inst.errors);
        });
        it('must contain all post-initialization properties', () => {
            expect(PromiseAdapter instanceof Function).toBe(true);
            expect(inst && typeof inst === 'object').toBe(true);
            expect(inst.batch instanceof Function).toBe(true);
            expect(inst.page instanceof Function).toBe(true);
            expect(inst.sequence instanceof Function).toBe(true);
            expect(inst.stream && typeof inst.stream === 'object').toBe(true);
            expect(inst.stream.read instanceof Function).toBe(true);
            expect(inst.errors && typeof inst.errors === 'object').toBeTruthy();
            expect(inst.errors.BatchError instanceof Function).toBe(true);
            expect(inst.errors.PageError instanceof Function).toBe(true);
            expect(inst.errors.SequenceError instanceof Function).toBe(true);
            expect(inst.$p instanceof Function).toBe(true);
        });
    });

    describe('initializing with adapter', () => {
        let adapter, inst, p;
        beforeEach(() => {
            adapter = new PromiseAdapter(() => {
                return 100;
            }, dummy, dummy);
            inst = lib.main(adapter);
            p = inst.$p(dummy);
        });
        it('must not throw any error', () => {
            expect(adapter).toBeTruthy();
            expect(inst).toBeTruthy();
            expect(p).toBe(100);
        });
    });

    describe('constructing adapter', () => {
        it('must be successful with new', () => {
            const adapter = new PromiseAdapter(dummy, dummy, dummy);
            expect(adapter instanceof PromiseAdapter).toBe(true);
        });
    });

    describe('multi-init', () => {

        const PromiseOne = [
            function (cb) {
                return new promise.Promise(cb);
            },
            () => {
                return promise.resolve('data-one');
            },
            function (reason) {
                return promise.reject(reason);
            }
        ];

        const PromiseTwo = [
            function (cb) {
                return new promise.Promise(cb);
            },
            () => {
                return promise.resolve('data-two');
            },
            function (reason) {
                return promise.reject(reason);
            }
        ];

        const one = new PromiseAdapter(...PromiseOne);
        const two = new PromiseAdapter(...PromiseTwo);
        let result;

        beforeEach(done => {
            const oneLib = lib.main(one);
            const twoLib = lib.main(two);

            spex.batch([
                twoLib.batch([]), oneLib.batch([])
            ])
                .then(data => {
                    result = data;
                    done();
                });
        });

        it('must be supported', () => {
            expect(result).toEqual(['data-two', 'data-one']);
        });
    });

});
