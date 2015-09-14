'use strict';

var utils = require('../utils');
var $p; // promise wrapper;

// channel: the combination of stream+page - pumping pages from source, resolving and passing into the destination;

// Original Idea:
// pump paged data from source to the destination, till the source is dry;
// both source and dest are functions that return a promise;
// context can be passed to allow paging logic + state control;


// Channels promises from the source and into the destination;
// The source can provide either a single promise object or an array of promises;
// Continues till source returns null/undefined, and resolves with the total number
// of objects?
// Destination must return a promise, which if rejects, the method also rejects with the reason;
// Could be called "stream"???

/**
 * @method channel
 * @param source
 * @param dest
 */
function channel(source, dest) {

}

module.exports = function (config) {
    $p = config.promise;
    return channel;
};
