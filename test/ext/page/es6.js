'use strict';

var lib = require('../../header');
var promise = lib.promise;
var spex = lib.main(promise);

describe("Page callbacks generators", function () {
    var result, ctx, context = {};

    function * source() {
        ctx = this;
        return yield promise.resolve(['src']);
    }

    function * dest(_, data) {
        this.data = data;
        return yield promise.resolve('dest');
    }

    beforeEach(function (done) {
        spex.page.call(context, source, {dest: dest, limit: 1})
            .then(function (data) {
                result = data;
                done();
            });
    });
    it("must resolve successfully", function () {
        expect(result.pages).toBe(1);
        expect(result.total).toBe(1);
        expect(ctx).toBe(context);
        expect(context.data).toEqual(['src']);
    });
});
