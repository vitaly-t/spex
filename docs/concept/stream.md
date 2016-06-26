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
    })
    .catch(function (error) {
        console.log("ERROR:", error);
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
    })
    .catch(function (error) {
        console.log("ERROR:", error);
    });
```

[read]:http://vitaly-t.github.io/spex/stream.html#.read
