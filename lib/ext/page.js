'use strict';

var utils = require('../utils');
var $p; // promise wrapper;

// same as stream, except without destination;
// plus, it will pass in the page index;
// and it will resolve with {pages, total}

// unlike sequence, it cannot track anything;

/**
 * @method page
 * @param source
 * @param dest
 */
function page(source, dest) {
}

module.exports = function (promise) {
    $p = promise;
    return page;
};
