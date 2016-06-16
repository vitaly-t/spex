'use strict';

var lib = require('../../header');
var promise = lib.promise;
var spex = lib.main(promise);

describe("Batch - negative", function () {

    describe("with invalid parameters", function () {
        var error;
        beforeEach(function (done) {
            spex.batch()
                .catch(function (e) {
                    error = e;
                    done();
                });
        });
        it("must reject an invalid array of values", function () {
            expect(error instanceof TypeError).toBe(true);
            expect(error.message).toBe("Batch requires an array of values.");
        });
    });

    describe("callback error", function () {

        describe("passing success", function () {
            var r, msg = "callback error";
            beforeEach(function (done) {

                function cb() {
                    throw msg;
                }

                spex.batch([1], cb)
                    .catch(function (reason) {
                        r = reason;
                        done();
                    })

            });
            it("must reject correctly", function () {
                expect(r).toEqual([{
                    success: false,
                    result: msg,
                    origin: {success: true, result: 1}
                }]);
                expect(r.getErrors()).toEqual([msg]);
            })
        });

        describe("passing error", function () {
            var r, msg = "callback error";
            beforeEach(function (done) {

                function cb() {
                    throw msg;
                }

                spex.batch([promise.reject('ops!')], cb)
                    .catch(function (reason) {
                        r = reason;
                        done();
                    })
            });
            it("must reject correctly", function () {
                expect(r).toEqual([{
                    success: false,
                    result: msg,
                    origin: {success: false, result: 'ops!'}
                }]);
                expect(r.getErrors()).toEqual([msg]);
            })
        });

    });

    describe("callback reject", function () {

        var r, msg = "callback reject";
        beforeEach(function (done) {

            function cb(index) {
                if (index) {
                    return promise.resolve();
                } else {
                    return promise.reject(msg);
                }
            }

            spex.batch([1, 2], {cb: cb})
                .catch(function (reason) {
                    r = reason;
                    done();
                })

        });

        it("must reject correctly", function () {
            expect(r).toEqual([
                {
                    success: false,
                    result: msg,
                    origin: {success: true, result: 1}
                },
                {
                    success: true,
                    result: 2
                }]);
            expect(r.getErrors()).toEqual([msg]);
        })
    });

    describe("input reject", function () {
        var error, msg = "no values";

        function value() {
            throw new Error(msg);
        }

        beforeEach(function (done) {
            spex.batch([value])
                .catch(function (reason) {
                    error = reason;
                    done();
                })
        });
        it("must reject correctly", function () {
            expect(error).toEqual([
                {
                    success: false,
                    result: new Error(msg)
                }
            ]);
            expect(error.first).toEqual(new Error(msg));
            expect(error.message).toBe(msg);
        });
    });

    describe("input: null reject", function () {
        var error;

        function value() {
            throw null;
        }

        beforeEach(function (done) {
            spex.batch([value])
                .catch(function (reason) {
                    error = reason;
                    done();
                })
        });
        it("must reject correctly", function () {
            expect(error).toEqual([
                {
                    success: false,
                    result: null
                }
            ]);
            expect(error.first).toBe(null);
            expect(error.message).toBe(null);
        });
    });

    describe("input: simple reject", function () {
        var error;

        function value() {
            throw 123;
        }

        beforeEach(function (done) {
            spex.batch([value])
                .catch(function (reason) {
                    error = reason;
                    done();
                })
        });
        it("must reject correctly", function () {
            expect(error).toEqual([
                {
                    success: false,
                    result: 123
                }
            ]);
            expect(error.first).toBe(123);
            expect(error.message).toBe(123);
        });
    });

    describe("nested batch reject", function () {
        var error, msg = "internal failure";

        function problem() {
            throw msg;
        }

        function value() {
            return spex.batch([problem]);
        }

        beforeEach(function (done) {
            spex.batch([value])
                .catch(function (reason) {
                    error = reason;
                    done();
                });
        });
        it("must be reported correctly", function () {
            expect(error).toEqual([{success: false, result: [{success: false, result: msg}]}]);
            expect(error.getErrors()).toEqual([[msg]]);
            expect(error.first).toBe(msg);
            expect(error.message).toBe(msg);
        });
    });
});

describe("Batch - positive", function () {

    describe("empty input", function () {
        var result;
        beforeEach(function (done) {
            spex.batch([])
                .then(function (data) {
                    result = data;
                    done();
                });
        });
        it("must resolve with an empty result", function () {
            expect(result).toEqual([]);
            expect(typeof result.duration).toBe('number');
        });
    });

    describe("this context", function () {
        var ctx, context = {};

        function test() {
            ctx = this;
        }

        beforeEach(function (done) {
            spex.batch.call(context, [test])
                .then(function () {
                    done();
                });
        });
        it("must be passed in correctly", function () {
            expect(ctx).toBe(context);
        });

    });

});
