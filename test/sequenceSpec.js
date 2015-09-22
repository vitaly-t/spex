'use strict';

var lib = require('./header');
var promise = lib.promise;
var spex = lib.main(promise);

var dummy = function () {
};

describe("Sequence - negative", function () {

    describe("with invalid parameters", function () {
        it("must detect invalid source", function () {
            expect(function () {
                spex.sequence();
            }).toThrow("Invalid sequence source.");
        });
        it("must detect invalid destination", function () {
            expect(function () {
                spex.sequence(dummy, 123);
            }).toThrow("Invalid sequence destination.");
        });
    });

    describe("source error", function () {

        var r, msg = "source error";
        beforeEach(function (done) {
            function source() {
                throw msg;
            }

            spex.sequence(source)
                .catch(function (reason) {
                    r = reason;
                    done();
                })

        });

        it("must reject correctly", function () {
            expect(r).toEqual({
                index: 0,
                error: msg,
                source: undefined
            });
        })
    });

    describe("source reject", function () {

        var r, msg = "source reject";
        beforeEach(function (done) {
            function source() {
                return promise.reject(msg);
            }

            spex.sequence(source)
                .catch(function (reason) {
                    r = reason;
                    done();
                })

        });

        it("must reject correctly", function () {
            expect(r).toEqual({
                index: 0,
                error: msg,
                source: undefined
            });
        })
    });

    describe("destination error", function () {

        var r, msg = "destination error";
        beforeEach(function (done) {
            function source() {
                return 123;
            }

            function dest() {
                throw msg;
            }

            spex.sequence(source, dest)
                .catch(function (reason) {
                    r = reason;
                    done();
                })

        });

        it("must reject correctly", function () {
            expect(r).toEqual({
                index: 0,
                error: msg,
                dest: 123
            });
        })
    });

    describe("destination reject", function () {

        var r, msg = "destination reject";
        beforeEach(function (done) {
            function source() {
                return 123;
            }

            function dest() {
                return promise.reject(msg);
            }

            spex.sequence(source, dest)
                .catch(function (reason) {
                    r = reason;
                    done();
                })

        });

        it("must reject correctly", function () {
            expect(r).toEqual({
                index: 0,
                error: msg,
                dest: 123
            });
        })
    });

});

describe("Sequence - positive", function () {

    describe("with a limit", function () {
        var result, limit = 100;

        function source() {
            return 123;
        }

        beforeEach(function (done) {
            spex.sequence(source, null, limit)
                .then(function (data) {
                    result = data;
                })
                .finally(function () {
                    done();
                });
        });

        it("must match the limit", function () {
            expect(result && result instanceof Object).toBeTruthy();
            expect(result.total).toBe(limit);
            expect('duration' in result).toBe(true);
        });

    });
});