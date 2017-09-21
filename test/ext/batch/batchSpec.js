'use strict';

var lib = require('../../header');
var promise = lib.promise;
var spex = lib.main(promise);

var isError = lib.isError;

describe('Batch - negative', function () {

    describe('with invalid parameters', function () {
        var error;
        beforeEach(function (done) {
            spex.batch()
                .catch(function (e) {
                    error = e;
                    done();
                });
        });
        it('must reject an invalid array of values', function () {
            expect(isError(error)).toBe(true);
            expect(error instanceof TypeError).toBe(true);
            expect(error.message).toBe('Method \'batch\' requires an array of values.');
        });
    });

    describe('callback error', function () {

        describe('passing success', function () {
            var r, err = new Error('callback error');
            beforeEach(function (done) {

                function cb() {
                    throw err;
                }

                spex.batch([1], {cb: cb})
                    .catch(function (reason) {
                        r = reason;
                        done();
                    });

            });
            it('must reject correctly', function () {
                expect(isError(r)).toBe(true);
                expect(r.data).toEqual([{
                    success: false,
                    result: err,
                    origin: {success: true, result: 1}
                }]);
                expect(r.getErrors()).toEqual([err]);
            });
        });

        describe('passing error', function () {
            var r, err = new Error('callback error'), rejectError = new Error('ops!');
            beforeEach(function (done) {

                function cb() {
                    throw err;
                }

                spex.batch([promise.reject(rejectError)], {cb: cb})
                    .catch(function (reason) {
                        r = reason;
                        done();
                    });
            });
            it('must reject correctly', function () {
                expect(isError(r)).toBe(true);
                expect(r.data).toEqual([{
                    success: false,
                    result: err,
                    origin: {success: false, result: rejectError}
                }]);
                expect(r.getErrors()).toEqual([err]);
            });
        });

    });

    describe('callback reject', function () {

        var r, err = new Error('callback reject');
        beforeEach(function (done) {

            function cb(index) {
                if (index) {
                    return promise.resolve();
                }
                return promise.reject(err);
            }

            spex.batch([1, 2], {cb: cb})
                .catch(function (reason) {
                    r = reason;
                    done();
                });

        });

        it('must reject correctly', function () {
            expect(isError(r)).toBe(true);
            expect(r.data).toEqual([
                {
                    success: false,
                    result: err,
                    origin: {success: true, result: 1}
                },
                {
                    success: true,
                    result: 2
                }]);
            expect(r.getErrors()).toEqual([err]);
        });
    });

    describe('input reject', function () {
        var r, err = new Error('no values');

        function value() {
            throw new Error(err);
        }

        beforeEach(function (done) {
            spex.batch([value])
                .catch(function (reason) {
                    r = reason;
                    done();
                });
        });
        it('must reject correctly', function () {
            expect(isError(r)).toBe(true);
            expect(r.data).toEqual([
                {
                    success: false,
                    result: err
                }
            ]);
            expect(r.first).toEqual(err);
        });
    });

    describe('input: null reject', function () {
        var r, err = new Error(null);

        function value() {
            throw err;
        }

        beforeEach(function (done) {
            spex.batch([value])
                .catch(function (reason) {
                    r = reason;
                    done();
                });
        });
        it('must reject correctly', function () {
            expect(isError(r)).toBe(true);
            expect(r.data).toEqual([
                {
                    success: false,
                    result: err
                }
            ]);
            expect(r.first).toBe(err);
            expect(r.message).toBe('null');
        });
    });

    describe('input: simple reject', function () {
        var r, err = new Error(123);

        function value() {
            throw err;
        }

        beforeEach(function (done) {
            spex.batch([value])
                .catch(function (reason) {
                    r = reason;
                    done();
                });
        });

        it('must reject correctly', function () {
            expect(isError(r)).toBe(true);
            expect(r.data).toEqual([
                {
                    success: false,
                    result: err
                }
            ]);
            expect(r.first).toBe(err);
            expect(r.message).toBe('123');
        });
    });

    describe('nested batch reject', function () {

        describe('with error', function () {
            var error, err = new Error('internal failure');

            function problem() {
                throw err;
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
            it('must be reported correctly', function () {
                expect(isError(error)).toBe(true);
                expect(error.first).toEqual(err);
                expect(error.getErrors()).toEqual([[err]]);
                expect(error.message).toBe(err.message);
            });
        });

        describe('with value', function () {
            var error, err = 'internal failure';

            function problem() {
                throw err;
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

            it('must be reported correctly', function () {
                expect(isError(error)).toBe(true);
                expect(error.first).toEqual(err);
                expect(error.getErrors()).toEqual([[err]]);
                expect(error.message).toBe(err);
                expect(error.inspect()).toContain('stat: { total: 1, succeeded: 0, failed: 1, duration:');
            });
        });

    });
});

describe('Batch - positive', function () {

    describe('empty input', function () {
        var result;
        beforeEach(function (done) {
            spex.batch([])
                .then(function (data) {
                    result = data;
                    done();
                });
        });
        it('must resolve with an empty result', function () {
            expect(result).toEqual([]);
            expect(typeof result.duration).toBe('number');
        });
    });

    describe('this context', function () {
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

        it('must be passed in correctly', function () {
            expect(ctx).toBe(context);
        });

    });

});
