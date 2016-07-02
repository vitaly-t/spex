'use strict';

var lib = require('../../header');
var promise = lib.promise;
var spex = lib.main(promise);

var isError = lib.isError;
var PageError = require('../../../lib/errors/page');

describe("Page - negative", function () {

    describe("with invalid parameters", function () {
        var error;
        beforeEach(function (done) {
            spex.page()
                .catch(function (e) {
                    error = e;
                    done();
                });
        });
        it("must reject an invalid source function", function () {
            expect(isError(error)).toBe(true);
            expect(error instanceof TypeError).toBe(true);
            expect(error.message).toBe("Parameter 'source' must be a function.");
        });
    });

    describe("source error", function () {

        describe("with Error", function () {
            var r, err = new Error("source error");

            beforeEach(function (done) {
                function source() {
                    throw err;
                }

                spex.page(source)
                    .catch(function (reason) {
                        r = reason;
                        done();
                    })
            });

            it("must reject correctly", function () {
                expect(isError(r)).toBe(true);
                expect(r instanceof PageError).toBe(true);
                expect(r.index).toBe(0);
                expect(r.error).toBe(err);
                expect('source' in r).toBe(true);
                expect(r.source).toBeUndefined();
                expect('dest' in r).toBe(false);
                expect(r.inspect()).toContain("reason: Source 'source' threw an error at index 0.");
            })
        });

        describe("with a string value", function () {
            var r, err = "source error";

            beforeEach(function (done) {

                spex.page(function () {
                    throw err;
                })
                    .catch(function (reason) {
                        r = reason;
                        done();
                    })
            });

            it("must reject correctly", function () {
                expect(isError(r)).toBe(true);
                expect(r instanceof PageError).toBe(true);
                expect(r.index).toBe(0);
                expect(r.error).toBe(err);
                expect('source' in r).toBe(true);
                expect(r.source).toBeUndefined();
                expect('dest' in r).toBe(false);
                expect(r.inspect()).toContain("reason: Source <anonymous> threw an error at index 0.");
            })
        });

        describe("with a non-string value", function () {
            var r, err = 123;

            beforeEach(function (done) {

                spex.page(function () {
                    throw err;
                })
                    .catch(function (reason) {
                        r = reason;
                        done();
                    })
            });

            it("must reject correctly", function () {
                expect(isError(r, 'PageError')).toBe(true);
                expect(r.error).toBe(err);
                expect(r.message).toBe('123');
            })
        });

    });

    describe("source reject", function () {

        var r, err = new Error("source reject");

        beforeEach(function (done) {
            function source() {
                return promise.reject(err);
            }

            spex.page(source)
                .catch(function (reason) {
                    r = reason;
                    done();
                })

        });

        it("must reject correctly", function () {
            expect(isError(r)).toBe(true);
            expect(r instanceof PageError);
            expect(r.index).toBe(0);
            expect(r.error).toBe(err);
            expect('source' in r).toBe(true);
            expect(r.source).toBeUndefined();
            expect(r.inspect()).toContain("reason: Source 'source' returned a rejection at index 0.");
        })
    });

    describe("destination error", function () {

        var r, err = new Error("destination error");
        beforeEach(function (done) {
            function source() {
                return [1, 2, 3];
            }

            function dest() {
                throw err;
            }

            spex.page(source, dest)
                .catch(function (reason) {
                    r = reason;
                    done();
                })
        });

        it("must reject correctly", function () {
            expect(isError(r)).toBe(true);
            expect(r instanceof PageError).toBe(true);
            expect(r.index).toBe(0);
            expect(r.error).toBe(err);
            expect(r.dest).toEqual([1, 2, 3]);
            expect(r.inspect()).toContain("reason: Destination 'dest' threw an error at index 0.");
        })
    });

    describe("destination reject", function () {

        var r, err = new Error("destination reject");
        beforeEach(function (done) {
            function source() {
                return [1, 2, 3];
            }

            function dest() {
                return promise.reject(err);
            }

            spex.page(source, dest)
                .catch(function (reason) {
                    r = reason;
                    done();
                })
        });

        it("must reject correctly", function () {
            expect(isError(r)).toBe(true);
            expect(r instanceof PageError).toBe(true);
            expect(r.index).toBe(0);
            expect(r.error).toBe(err);
            expect(r.dest).toEqual([1, 2, 3]);
            expect(r.inspect()).toContain("reason: Destination 'dest' returned a rejection at index 0.");
            expect(r.inspect() !== r.toString(1)).toBe(true);
        })
    });

    describe("page returns wrong value", function () {
        var r, msg = "Unexpected data returned from the source.";

        function source(idx) {
            if (!idx) {
                return [1, promise.resolve(2), 3];
            }
            return 123;
        }

        beforeEach(function (done) {
            spex.page(source)
                .catch(function (reason) {
                    r = reason;
                    done();
                });
        });

        it("must reject correctly", function () {
            expect(isError(r)).toBe(true);
            expect(r instanceof PageError).toBe(true);
            expect(r.index).toBe(1);
            expect(r.error instanceof Error).toBe(true);
            expect(r.message).toBe(msg);
            expect(r.source).toEqual([1, 2, 3]);
            expect(r.inspect()).toContain("reason: Source 'source' returned a non-array value at index 1.");
        });
    });

    describe("page data fail", function () {
        var error, err = new Error('second');

        function source(idx) {
            if (idx > 1) {
                return [1, promise.reject(err), 3];
            }
            return [];
        }

        beforeEach(function (done) {
            spex.page(source, {})
                .catch(function (reason) {
                    error = reason;
                    done();
                });
        });

        it("must reject correctly", function () {
            expect(error.index).toBe(2);
            expect(error.error.name).toBe("BatchError");
            expect(error.error.data).toEqual([
                {
                    success: true,
                    result: 1
                },
                {
                    success: false,
                    result: err
                },
                {
                    success: true,
                    result: 3
                }
            ]);
            expect(isError(error)).toBe(true);
            expect(error.message).toBe('second');
            expect(error.inspect()).toContain("reason: Page with index 2 rejected.");
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
            expect(result && typeof result === 'object').toBe(true);
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
            spex.page(source, {limit: limit})
                .then(function (data) {
                    result = data;
                    done();
                });
        });

        it("must resolve correctly", function () {
            expect(result && typeof result === 'object').toBe(true);
            expect(result.pages).toBe(limit);
            expect(result.total).toBe(limit * 3);
            expect('duration' in result).toBe(true);
        });
    });

    describe("this context", function () {
        var ctx, context = {};

        function source() {
            ctx = this;
        }

        beforeEach(function (done) {
            spex.page.call(context, source)
                .then(function () {
                    done();
                });
        });
        it("must be passed in correctly", function () {
            expect(ctx).toBe(context);
        });

    });

});
