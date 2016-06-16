'use strict';

var $npm = {
    BatchError: require('./batch'),
    PageError: require('./page'),
    SequenceError: require('./sequence')
};

module.exports = {
    BatchError: $npm.BatchError,
    PageError: $npm.PageError,
    SequenceError: $npm.SequenceError
};

Object.freeze(module.exports);
