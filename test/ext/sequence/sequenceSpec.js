'use strict';

var lib = require('../../header');
var promise = lib.promise;
var spex = lib.main(promise);

describe("Sequence - negative", function () {

    describe("with invalid parameters", function () {
        it("must detect invalid source", function () {
            expect(function () {
                spex.sequence();
            }).toThrow("Invalid sequence source.");
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
            spex.sequence(source, {limit: limit})
                .then(function (data) {
                    result = data;
                })
                .finally(function () {
                    done();
                });
        });
        it("must match the limit", function () {
            expect(result && typeof result === 'object').toBe(true);
            expect(result.total).toBe(limit);
            expect('duration' in result).toBe(true);
        });
    });

    describe("tracking", function () {
        var result, tracked = [];

        function source(idx) {
            if (idx < 3) {
                return idx;
            }
        }

        function dest(idx, data) {
            tracked.push(data);
            if (idx) {
                return promise.resolve();
            }
        }

        beforeEach(function (done) {
            spex.sequence(source, {dest: dest, track: true})
                .then(function (data) {
                    result = data;
                })
                .finally(function () {
                    done();
                });
        });
        it("must track and return the sequence", function () {
            expect(result instanceof Array).toBe(true);
            expect('duration' in result).toBe(true);
            expect(result).toEqual([0, 1, 2]);
            expect(result).toEqual(tracked);
        });
    });

    describe("this context", function () {
        var ctx, context = {};

        function source() {
            ctx = this;
        }

        beforeEach(function (done) {
            spex.sequence.call(context, source)
                .then(function () {
                    done();
                });
        });
        it("must be passed in correctly", function () {
            expect(ctx).toBe(context);
        });

    });

});
