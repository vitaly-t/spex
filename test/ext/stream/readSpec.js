'use strict';

var fs = require('fs');
var lib = require('../../header');
var promise = lib.promise;
var spex = lib.main(promise);

var dummy = function () {
};

describe("Stream/Read - negative", function () {

    var stm;
    beforeEach(function () {
        stm = fs.createReadStream(__filename);
    });

    afterEach(function () {
        stm.destroy();
    });

    describe("invalid parameter", function () {

        it("stream - must throw an error", function () {
            expect(function () {
                spex.stream.read(null);
            }).toThrow(new TypeError("Readable stream is required."));
        });

        it("receiver - must throw an error", function () {
            expect(function () {
                spex.stream.read(stm);
            }).toThrow(new TypeError("Invalid stream receiver."));
        })

    });

});

describe("Stream/Read - positive", function () {

    describe("End-stream, returning promises", function () {
        var stm, result;
        beforeEach(function (done) {
            stm = fs.createReadStream(__filename);
            spex.stream.read(stm, receiver)
                .then(function (data) {
                    result = data;
                    done();
                });
            function receiver() {
                return promise.resolve();
            }
        });
        afterEach(function () {
            stm.destroy();
        });

        it("must resolve with full statistics", function () {
            testStat(result);
        });
    });

    describe("Close-stream with empty receiver", function () {
        var stm, result;
        beforeEach(function (done) {
            stm = fs.createReadStream(__filename);
            spex.stream.read(stm, receiver, true)
                .then(function (data) {
                    result = data;
                    done();
                });
            function receiver() {
                return promise.resolve();
            }
        });
        afterEach(function () {
            stm.destroy();
        });

        it("must resolve with full statistics", function () {
            testStat(result);
        });
    });

    function testStat(obj) {
        expect(obj && obj instanceof Object).toBeTruthy();
        expect(obj.reads > 0).toBe(true);
        expect(obj.calls > 0).toBe(true);
        expect(obj.reads >= obj.calls).toBe(true);
        expect(obj.size > 0).toBe(true);
        expect(obj.duration >= 0).toBe(true);
    }

});
