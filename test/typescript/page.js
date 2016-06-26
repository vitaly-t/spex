/// <reference path='../../typescript/spex' />
"use strict";
var spexLib = require('spex');
var spex = spexLib(Promise);
function source() {
}
spex.page(source)
    .then(function (data) {
    var p = data.pages;
})
    .catch(function (error) {
    var e = error;
    var duration = e.duration;
});
//# sourceMappingURL=page.js.map