'use strict';

var lib = require('../header');
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
            expect(r.getError()).toBe(msg);
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

    describe("page return wrong value", function () {
        var error, msg = "Unexpected data returned from the source.";

        function source(idx) {
            if (!idx) {
                return [1, promise.resolve(2), 3];
            }
            return 123;
        }

        beforeEach(function (done) {
            spex.page(source)
                .catch(function (reason) {
                    error = reason;
                    done();
                });
        });

        it("must reject correctly", function () {
            expect(error).toEqual({
                index: 1,
                source: [1, 2, 3],
                error: msg
            });
        });
    });

    describe("page data fail", function () {
        var error;

        function source(idx) {
            if (idx > 1) {
                return [1, promise.reject(2), 3];
            }
            return [];
        }

        beforeEach(function (done) {
            spex.page(source)
                .catch(function (reason) {
                    error = reason;
                    done();
                });
        });

        it("must reject correctly", function () {
            expect(error).toEqual({
                index: 2,
                data: [
                    {
                        success: true,
                        result: 1
                    },
                    {
                        success: false,
                        result: 2
                    },
                    {
                        success: true,
                        result: 3
                    }
                ]
            });
            expect(error.getError()).toBe(2);
        });
    });

});

describe("Page - positive", function () {

    describe("with mixed data types", function () {

        var result, tracking = [];

        function val() {
            return spex.batch(['one']);
        }

        function source(idx) {
            switch (idx) {
                case 0:
                    return [1, promise.resolve(2), 3];
                case 1:
                    return [];
                case 2:
                    return [undefined, promise.resolve(), true, val];
                default:
                    break;
            }
        }

        function dest(idx, data) {
            tracking.push(data);
            if (!idx) {
                return promise.resolve();
            }
        }

        beforeEach(function (done) {
            spex.page(source, dest)
                .then(function (data) {
                    result = data;
                    done();
                });
        });

        it("must return all the data", function () {
            expect(result && result instanceof Object).toBeTruthy();
            expect(result.pages).toBe(3);
            expect(result.total).toBe(7);
            expect(typeof result.duration).toBe('number');
            expect(tracking).toEqual([
                [1, 2, 3], [], [undefined, undefined, true, ['one']]
            ]);
        });
    });

    describe("reaching limit", function () {
        var result, limit = 100;

        function source(idx) {
            return [1, idx, 'last'];
        }

        beforeEach(function (done) {
            spex.page(source, null, limit)
                .then(function (data) {
                    result = data;
                    done();
                });
        });

        it("must resolve correctly", function () {
            expect(result && result instanceof Object).toBeTruthy();
            expect(result.pages).toBe(limit);
            expect(result.total).toBe(limit * 3);
            expect('duration' in result).toBe(true);
        });
    });
});
