/// <reference path='../../typescript/spex' />
"use strict";
const spexLib = require('spex');
var spex = spexLib(Promise);
function source() {
}
spex.sequence(source)
    .then(data => {
    var r = data[0].anything;
})
    .catch(error => {
    var e = error;
    var duration = e.duration;
});
