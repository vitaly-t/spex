'use strict';

var lib = require('./header');
var promise = lib.promise;
var spex = lib.main(promise);

var dummy = function () {
};

describe("Page - negative", function () {

    describe("with invalid parameters", function () {
        it("must detect invalid source", function () {
            expect(function () {
                spex.page();
            }).toThrow("Invalid page source.");
        });
        it("must detect invalid destination", function () {
            expect(function () {
                spex.page(dummy, 123);
            }).toThrow("Invalid page destination.");
        });
    });

    describe("source error", function () {

        var r, msg = "source error";
        beforeEach(function (done) {
            function source() {
                throw msg;
            }

            spex.page(source)
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

            spex.page(source)
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
                return [1, 2, 3];
            }

            function dest() {
                throw msg;
            }

            spex.page(source, dest)
                .catch(function (reason) {
                    r = reason;
                    done();
                })
        });

        it("must reject correctly", function () {
            expect(r).toEqual({
                index: 0,
                error: msg,
                dest: [1, 2, 3]
            });
        })
    });

    describe("destination reject", function () {

        var r, msg = "destination reject";
        beforeEach(function (done) {
            function source() {
                return [1, 2, 3];
            }

            function dest() {
                return promise.reject(msg);
            }

            spex.page(source, dest)
                .catch(function (reason) {
                    r = reason;
                    done();
                })

        });

        it("must reject correctly", function () {
            expect(r).toEqual({
                index: 0,
                error: msg,
                dest: [1, 2, 3]
            });
        })
    });

});
