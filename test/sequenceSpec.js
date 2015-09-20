'use strict';

var lib = require('./header');
var promise = lib.promise;
var spex = lib.main(promise);

var dummy = function () {
};

describe("Sequence", function () {

    describe("source error", function () {

        var r, msg = "source error";
        beforeEach(function (done) {
            function source() {
                throw msg;
            }

            spex.sequence(source)
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

});
