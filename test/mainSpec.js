'use strict';

var lib = require('./header');
var promise = lib.promise;
var spex = lib.main(promise);

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
});

describe("Main - positive", function () {

    describe("protocol", function () {
        var inst;
        beforeEach(function () {
            inst = lib.main(promise);
        });
        it("must be complete", function () {
            expect(inst && typeof inst === 'object').toBe(true);
            expect(inst.batch instanceof Function).toBe(true);
            expect(inst.page instanceof Function).toBe(true);
            expect(inst.sequence instanceof Function).toBe(true);
            expect(inst.stream && typeof inst.stream === 'object').toBe(true);
            expect(inst.stream.read instanceof Function).toBe(true);
            expect(inst.$p instanceof Function).toBe(true);
        });
    });
});
