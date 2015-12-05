'use strict';

var fs = require('fs');
var lib = require('../../header');
var promise = lib.promise;
var spex = lib.main(promise);

describe("Stream.read", function () {

    var stm;

    beforeEach(function () {
        stm = fs.createReadStream(__filename);
    });

    afterEach(function () {
        stm.destroy();
    });

    describe("this with generator", function () {
        var result, ctx, context = {};

        function * receiver() {
            ctx = this;
            return yield 'ok';
        }

        beforeEach(function (done) {
            spex.stream.read.call(context, stm, receiver)
                .then(function (data) {
                    result = data;
                    done();
                });
        });

        it("must resolve with full statistics", function () {
            expect(ctx).toBe(context);
        });
    });

});
