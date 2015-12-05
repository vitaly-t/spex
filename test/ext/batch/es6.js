'use strict';

var lib = require('../../header');
var promise = lib.promise;
var spex = lib.main(promise);

describe("Batch callback as generator", function () {
    var result, ctx, context = {};

    function * cb() {
        ctx = this;
        return yield promise.resolve('yes');
    }

    beforeEach(function (done) {
        spex.batch.call(context, [1], cb)
            .then(function (data) {
                result = data;
                done();
            });
    });
    it("must resolve successfully", function () {
        expect(result).toEqual([1]);
        expect(ctx).toBe(context);
    });
});
