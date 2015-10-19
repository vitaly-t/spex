`stream` is a namespace within the library's root, with methods that implement stream operations,
and [read] is the only method currently supported.

**Synchronous Stream Processing**

```javascript
var stream = require('spex')(Promise).stream;
var fs = require('fs');

var rs = fs.createReadStream('values.txt');

function receiver(index, data, delay) {
    console.log("RECEIVED:", index, data, delay);
}

stream.read(rs, receiver)
    .then(function (data) {
        console.log("DATA:", data);
    }, function (reason) {
        console.log("REASON:", reason);
    });
```

**Asynchronous Stream Processing**

```javascript
var stream = require('spex')(Promise).stream;
var fs = require('fs');

var rs = fs.createReadStream('values.txt');

function receiver(index, data, delay) {
    return new Promise(function (resolve) {
        console.log("RECEIVED:", index, data, delay);
        resolve();
    });
}

stream.read(rs, receiver)
    .then(function (data) {
        console.log("DATA:", data);
    }, function (reason) {
        console.log("REASON:", reason);
    });
```

[read]:https://github.com/vitaly-t/spex/blob/master/docs/code/stream/read.md
