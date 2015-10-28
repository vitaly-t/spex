'use strict';

var fs = require('fs');
var lib = require('../../header');
var promise = lib.promise;
var spex = lib.main(promise);

var dummy = function () {
};

describe("Stream/Write - negative", function () {
    describe("any call", function () {
        it("must throe an error", function () {
            expect(function () {
                spex.stream.write();
            }).toThrow("Method not implemented.");
        })
    });
});

describe("Stream/Write - positive", function () {

});
