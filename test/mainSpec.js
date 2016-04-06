'use strict';

var util = require('util');
var lib = require('./header');
var promise = lib.promise;
var spex = lib.main(promise);
var PromiseAdapter = lib.main.PromiseAdapter;

var dummy = function () {
};

describe("Main - negative", function () {

    describe("passing invalid promise", function () {
        var error = "Invalid promise library specified."

        describe("as nothing", function () {
            it("must throw an error", function () {
                expect(function () {
                    lib.main();
                })
                    .toThrow(error);
            });
        });

        describe("as a wrong type", function () {
            it("must throw an error", function () {
                expect(function () {
                    lib.main(123);
                }).toThrow(error);
            });
        });

        describe("as a dummy function", function () {
            it("must throw an error", function () {
                expect(function () {
                    lib.main(dummy);
                })
                    .toThrow(error);
            });
        });

    });

    describe("passing invalid adapter", function () {
        it("must throw an error", function () {
            expect(function () {
                new PromiseAdapter();
            }).toThrow('Adapter requires a function to create a promise.');
            expect(function () {
                new PromiseAdapter(dummy);
            }).toThrow('Adapter requires a function to resolve a promise.');
            expect(function () {
                new PromiseAdapter(dummy, dummy);
            }).toThrow('Adapter requires a function to reject a promise.');
        });
    });
});

describe("Main - positive", function () {

    describe("protocol", function () {
        var inst;
        beforeEach(function () {
            inst = lib.main(promise);
        });
        it("must be complete", function () {
            expect(PromiseAdapter instanceof Function).toBe(true);
            expect(inst && typeof inst === 'object').toBe(true);
            expect(inst.batch instanceof Function).toBe(true);
            expect(inst.page instanceof Function).toBe(true);
            expect(inst.sequence instanceof Function).toBe(true);
            expect(inst.stream && typeof inst.stream === 'object').toBe(true);
            expect(inst.stream.read instanceof Function).toBe(true);
            expect(inst.$p instanceof Function).toBe(true);
        });
    });

    describe("initializing with adapter", function () {
        var adapter, inst, p;
        beforeEach(function () {
            adapter = new PromiseAdapter(function () {
                return 100;
            }, dummy, dummy);
            inst = lib.main(adapter);
            p = inst.$p(dummy);
        });
        it("must not throw any error", function () {
            expect(adapter).toBeTruthy();
            expect(inst).toBeTruthy();
            expect(p).toBe(100);
        });
    });

    describe("constructing adapter", function () {
        it("must be successful with new", function () {
            var adapter = new PromiseAdapter(dummy, dummy, dummy);
            expect(adapter instanceof PromiseAdapter).toBe(true);
        });
        it("must be successful without new", function () {
            var adapter = PromiseAdapter(dummy, dummy, dummy);
            expect(adapter instanceof PromiseAdapter).toBe(true);
        });
        it("must be successful with wrong context", function () {
            var obj = {};
            var adapter = PromiseAdapter.call(obj, dummy, dummy, dummy);
            expect(adapter instanceof PromiseAdapter).toBe(true);
        });
    });

    describe("multi-init", function () {

        var PromiseOne = [
            function (cb) {
                return new promise.Promise(cb);
            },
            function (data) {
                return promise.resolve('data-one');
            },
            function (reason) {
                return promise.reject(reason);
            }
        ];

        var PromiseTwo = [
            function (cb) {
                return new promise.Promise(cb);
            },
            function (data) {
                return promise.resolve('data-two');
            },
            function (reason) {
                return promise.reject(reason);
            }
        ];
        
        var one = PromiseAdapter.apply(null, PromiseOne);
        var two = PromiseAdapter.apply(null, PromiseTwo);
        var result;
        
        beforeEach(function (done) {
            var oneLib = lib.main(one);
            var twoLib = lib.main(two);
            
            spex.batch([
                    twoLib.batch([]), oneLib.batch([])
                ])
                .then(function (data) {
                    result = data;
                    done();
                });
        });

        it("must be supported", function () {
            expect(result).toEqual(['data-two', 'data-one']);
        });
    });

});
