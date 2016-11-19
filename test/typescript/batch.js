"use strict";
const spexLib = require("spex");
var spex = spexLib(Promise);
spex.batch([])
    .then(data => {
    var r = data[0].anything;
})
    .catch(error => {
    var e = error;
    var duration = e.stat.duration;
});
//# sourceMappingURL=batch.js.map