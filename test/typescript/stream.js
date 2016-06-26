/// <reference path='../../typescript/spex' />
"use strict";
const spexLib = require('spex');
var spex = spexLib(Promise);
function cb() {
}
spex.stream.read(123, cb)
    .then(data => {
    var c = data.calls;
})
    .catch(error => {
});
