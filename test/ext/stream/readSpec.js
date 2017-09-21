'use strict';

var fs = require('fs');
var lib = require('../../header');
var promise = lib.promise;
var spex = lib.main(promise);

describe('Stream/Read - negative', function () {

    var stm;
    beforeEach(function () {
        stm = fs.createReadStream(__filename);
    });

    afterEach(function () {
        stm.destroy();
    });

    describe('invalid parameters', function () {

        describe(' - stream', function () {
            var error;
            beforeEach(function (done) {
                spex.stream.read(null)
                    .catch(function (e) {
                        error = e;
                        done();
                    });
            });
            it('must reject', function () {
                expect(error instanceof TypeError).toBe(true);
                expect(error.message).toBe('Readable stream is required.');
            });
        });

        describe(' - receiver', function () {
            var error;
            beforeEach(function (done) {
                spex.stream.read(stm)
                    .catch(function (e) {
                        error = e;
                        done();
                    });
            });
            it('must reject', function () {
                expect(error instanceof TypeError).toBe(true);
                expect(error.message).toBe('Invalid stream receiver.');
            });
        });

    });

    describe('error event', function () {
        var error;
        beforeEach(function (done) {
            function receiver() {
                stm.emit('error', new Error('Ops!'));
            }

            spex.stream.read(stm, receiver)
                .catch(function (err) {
                    error = err;
                    done();
                });
        });
        it('must reject with the right error', function () {
            expect(error instanceof Error).toBe(true);
            expect(error.message).toBe('Ops!');
        });
    });

    describe('receiver rejecting', function () {
        var error, err = new Error('stop');
        beforeEach(function (done) {
            function receiver() {
                return promise.reject(err);
            }

            spex.stream.read(stm, receiver)
                .catch(function (e) {
                    error = e;
                    done();
                });
        });
        it('must reject with the right error', function () {
            expect(error).toBe(err);
        });
    });

    describe('receiver throwing an error', function () {
        var error;
        beforeEach(function (done) {
            function receiver() {
                throw new Error('stop');
            }

            spex.stream.read(stm, receiver)
                .catch(function (err) {
                    error = err;
                    done();
                });
        });
        it('must reject with the right error', function () {
            expect(error instanceof Error).toBe(true);
            expect(error.message).toBe('stop');
        });
    });

});

describe('Stream/Read - positive', function () {

    var stm;

    beforeEach(function () {
        stm = fs.createReadStream(__filename);
    });

    afterEach(function () {
        stm.destroy();
    });

    describe('End-stream, returning promises', function () {
        var result;
        beforeEach(function (done) {
            spex.stream.read(stm, receiver)
                .then(function (data) {
                    result = data;
                    done();
                });
            function receiver() {
                return promise.resolve();
            }
        });
        it('must resolve with full statistics', function () {
            testStat(result);
        });
    });

    describe('Close-stream with empty receiver', function () {
        var result;
        beforeEach(function (done) {
            spex.stream.read(stm, receiver, {closable: true})
                .then(function (data) {
                    result = data;
                    done();
                });
            function receiver() {
                return promise.resolve();
            }
        });
        it('must resolve with full statistics', function () {
            testStat(result);
        });
    });

    function testStat(obj) {
        expect(obj && typeof obj === 'object').toBe(true);
        expect(obj.reads > 0).toBe(true);
        expect(obj.calls > 0).toBe(true);
        expect(obj.reads >= obj.calls).toBe(true);
        expect(obj.length > 0).toBe(true);
        expect(obj.duration >= 0).toBe(true);
    }

    describe('Reduced readSize', function () {
        var r;
        beforeEach(function (done) {
            spex.stream.read(stm, receiver, {readSize: 100})
                .then(function () {
                    done();
                });
            function receiver(index, data, delay) {
                r = {
                    index: index,
                    data: data,
                    delay: delay
                };
            }
        });

        it('must provide a delay', function () {
            expect(r && typeof r === 'object').toBe(true);
            expect(r.index > 0).toBe(true);
            expect(r.data).toBeTruthy();
            expect(r.delay >= 0).toBe(true);
        });
    });

});
