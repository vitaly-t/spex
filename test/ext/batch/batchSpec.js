'use strict';

var lib = require('../../header');
var promise = lib.promise;
var spex = lib.main(promise);

describe("Batch - negative", function () {

    describe("with invalid parameters", function () {
        it("must detect invalid array of values", function () {
            expect(function () {
                spex.batch();
            }).toThrow("Batch requires an array of values.");
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
            throw msg;
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
                    result: msg
                }
            ]);
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
            expect(error).toEqual([{success: false, result: [{success: false, result: 'internal failure'}]}]);
            expect(error.getErrors()).toEqual([[msg]]);
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
