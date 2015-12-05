'use strict';

var lib = require('../../header');
var promise = lib.promise;
var spex = lib.main(promise);

describe("Sequence callbacks generators", function () {
    var result, ctx, context = {};

    function * source(index) {
        ctx = this;
        if (!index) {
            return yield promise.resolve('src');
        }
    }

    function * dest(_, data) {
        this.data = data;
        return yield promise.resolve('dest');
    }

    beforeEach(function (done) {
        spex.sequence.call(context, source, {dest: dest, track: true})
            .then(function (data) {
                result = data;
                done();
            });
    });
    it("must resolve successfully", function () {
        expect(result).toEqual(['src']);
        expect(ctx).toBe(context);
        expect(context.data).toBe('src');
    });
});
