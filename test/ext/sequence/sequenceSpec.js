'use strict';

var lib = require('../../header');
var promise = lib.promise;
var spex = lib.main(promise);

var SequenceError = require('../../../lib/errors/sequence');

describe("Sequence - negative", function () {

    describe("with invalid parameters", function () {
        var error;
        beforeEach(function (done) {
            spex.sequence()
                .catch(function (e) {
                    error = e;
                    done();
                });
        });
        it("must reject an invalid source function", function () {
            expect(error instanceof TypeError).toBe(true);
            expect(error.message).toBe("Parameter 'source' must be a function.");
        });
    });

    describe("source error", function () {

        var error, msg = "source error";
        beforeEach(function (done) {
            function source() {
                throw new Error(msg);
            }

            spex.sequence(source)
                .catch(function (e) {
                    error = e;
                    done();
                })
        });

        it("must reject correctly", function () {
            expect(error instanceof SequenceError).toBe(true);
            expect(error.index).toBe(0);
            expect(error.message).toBe(msg);
            expect('source' in error).toBe(true);
            expect(error.source).toBeUndefined();
        })
    });

    describe("source reject", function () {

        var error, msg = "source reject";
        beforeEach(function (done) {
            function source() {
                return promise.reject(new Error(msg));
            }

            spex.sequence(source)
                .catch(function (e) {
                    error = e;
                    done();
                })

        });

        it("must reject correctly", function () {
            expect(error instanceof SequenceError).toBe(true);
            expect(error.index).toBe(0);
            expect(error.message).toBe(msg);
            expect('source' in error).toBe(true);
            expect(error.source).toBeUndefined();
        })
    });

    describe("destination error", function () {

        var error, msg = "destination error";
        beforeEach(function (done) {
            function source() {
                return 123;
            }

            function dest() {
                throw new Error(msg);
            }

            spex.sequence(source, dest)
                .catch(function (e) {
                    error = e;
                    done();
                })
        });

        it("must reject correctly", function () {
            expect(error instanceof SequenceError).toBe(true);
            expect(error.message).toBe(msg);
            expect(error.index).toBe(0);
            expect(error.dest).toBe(123);
        })
    });

    describe("destination reject", function () {

        var error, msg = "destination reject";
        beforeEach(function (done) {
            function source() {
                return 123;
            }

            function dest() {
                return promise.reject(new Error(msg));
            }

            spex.sequence(source, dest)
                .catch(function (e) {
                    error = e;
                    done();
                })
        });
        it("must reject correctly", function () {
            expect(error instanceof SequenceError).toBe(true);
            expect(error.index).toBe(0);
            expect(error.message).toBe(msg);
            expect(error.dest).toBe(123);
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
