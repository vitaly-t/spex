'use strict';

var lib = require('./header');
var promise = lib.promise;
var spex = lib.main(promise);

var dummy = function () {
};

describe("Main - negative", function () {

    describe("passing invalid promise", function () {
        var error = "Invalid promise library specified."

        describe("as nothing", function () {
            it("must throw an error", function () {
                expect(function () {
                    lib.main();
                }).toThrow(error);
            });
        });

        describe("as wrong type", function () {
            it("must throw an error", function () {
                expect(function () {
                    lib.main(123);
                }).toThrow(error);
            });
        });

        describe("as wrong function", function () {
            it("must throw an error", function () {
                expect(function () {
                    lib.main(dummy);
                }).toThrow(error);
            });
        });

    });

});

describe("Main - positive", function () {

});