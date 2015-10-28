## Data Throttling & Load Balancing

#### Terminology

*Data throttling* is processing data in limited chunks, as an intentional bottleneck added for predictable rate of processing.
It adds quantifiable throughput to control either resource consumption or a traffic quota.  
 
*Load balancing* is about enforcing a time quota on operations that need to take turns with other tasks in the system.
As such, its implementation is usually limited to a single system, while *data throttling* can be employed by multiple systems independently.

#### Solution

With the help of method [page], promises can be resolved in chunks, thus throttling the data processing, while method [sequence] can do the same
on the one-by-one basis. 
 
Both methods support return of promises from `source` or `destination` handlers, which allows injecting any necessary
delays needed to implement *load balancing*.

#### Examples

**Balanced Page Source**

The example below uses method [page] to initiate a sequence of 5 pages, and then logs the resolved data into the console.
The `source` function serves each page with a half-second delay.

```javascript
var spex = require('spex')(Promise);

function source(index, data, delay) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve([
                "page-" + index, // simple value;
                Promise.resolve(Date.now()) // promise value;
            ])
        }, 500); // wait 1/2 second before serving the next page;
    });
}

function logger(index, data, delay) {
    console.log("RESOLVED:", data);
}

spex.page(source, {dest: logger, limit: 5})
    .then(function (data) {
        console.log("FINISHED:", data);
    });
```

Output:

```
RESOLVED: [ 'page-0', 1446050510512 ]
RESOLVED: [ 'page-1', 1446050511012 ]
RESOLVED: [ 'page-2', 1446050511512 ]
RESOLVED: [ 'page-3', 1446050512012 ]
RESOLVED: [ 'page-4', 1446050512512 ]
FINISHED: { pages: 5, total: 10, duration: 2503 }
```

**Balanced Sequence Receiver**

In the following example we have a sequence that returns data while the index is less than 5, and the
destination function that enforces 1 second delay on processing each data resolved from the source.
 
```javascript 
var spex = require('spex')(Promise);

function source(index, data, delay) {
    console.log("SOURCE:", index, data, delay);
    if (index < 5) {
        return Promise.resolve(index);
    }
}

function dest(index, data, delay) {
    console.log("DEST:", index, data, delay);
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve();
        }, 1000);
    });
}

spex.sequence(source, dest)
    .then(function (data) {
        console.log("DATA:", data);
    });
```

Output:

```
SOURCE: 0 undefined undefined
DEST: 0 0 undefined
SOURCE: 1 0 1011
DEST: 1 1 1001
SOURCE: 2 1 1001
DEST: 2 2 1001
SOURCE: 3 2 1000
DEST: 3 3 1000
SOURCE: 4 3 1001
DEST: 4 4 1001
SOURCE: 5 4 1000
DATA: { total: 5, duration: 5013 }
```

[page]:https://github.com/vitaly-t/spex/blob/master/docs/code/page.md
[sequence]:https://github.com/vitaly-t/spex/blob/master/docs/code/sequence.md
