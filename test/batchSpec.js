'use strict';

var lib = require('./header');
var promise = lib.promise;
var spex = lib.main(promise);

var dummy = function () {
};

describe("Batch - negative", function () {

    describe("with invalid parameters", function () {
        it("must detect invalid array of values", function () {
            expect(function () {
                spex.batch();
            }).toThrow("Batch requires an array of values.");
        });
        it("must detect invalid callback", function () {
            expect(function () {
                spex.batch([], 123);
            }).toThrow("Invalid callback function specified.");
        });
    });

    describe("callback error", function () {

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
        })
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

            spex.batch([1, 2], cb)
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
        })
    });
});
