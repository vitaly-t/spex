'use strict';

var lib = require('./header');
var promise = lib.promise;
var spex = lib.main(promise);

describe("Generators", function () {

    var result, ctx = {}, context = {};

    function * positive() {
        ctx.positive = this;
        return yield promise.resolve('yes');
    }

    function * negative() {
        ctx.negative = this;
        return yield promise.reject(new Error('no'));
    }

    function * error() {
        ctx.error = this;
        throw new Error('ops!');
    }

    beforeEach(function (done) {
        spex.batch.call(context, [positive, negative, error])
            .catch(function (error) {
                result = error;
                done();
            });
    });

    it("must resolve successfully", function () {
        expect(result.data).toEqual([
            {
                success: true,
                result: 'yes'
            },
            {
                success: false,
                result: new Error('no')
            },
            {
                success: false,
                result: new Error('ops!')
            }
        ]);
        expect(ctx.positive).toBe(context);
        expect(ctx.negative).toBe(context);
        expect(ctx.error).toBe(context);
    });
});

