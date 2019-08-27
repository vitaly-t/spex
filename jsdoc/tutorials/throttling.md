---

### Terminology

*Data throttling* is processing data in limited chunks, as an intentional bottleneck added for predictable rate of processing /
quantifiable throughput, to control resources consumption and/or a traffic quota.  
 
*Load balancing* is enforcing a time quota on operations that need to take turns with other tasks in the system.
As such, its implementation is usually limited to a single system, while *data throttling* can be employed by multiple systems independently.

### Solution

With the help of method [page], promises can be resolved in chunks, thus throttling the data processing, while method [sequence] can do the same
on a one-by-one basis. 
 
Both methods support return of promises from `source` or `destination` callbacks, which allows injecting any necessary
delays needed to implement *load balancing*.

### Examples

##### Balanced Page Source

The example below uses method [page] to initiate a sequence of 5 pages, and then logs the resolved data into the console.
The `source` function serves each page with a half-second delay.

```js
const spex = require('spex')(Promise);

function source(index, data, delay) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve([
                'page-' + index, // simple value;
                Promise.resolve(Date.now()) // promise value;
            ])
        }, 500); // wait 1/2 second before serving the next page;
    });
}

function logger(index, data, delay) {
    console.log('LOG:', data);
}

spex.page(source, {dest: logger, limit: 5})
    .then(data => {
        console.log('FINISHED:', data);
    });
```

Output:

```
LOG: [ 'page-0', 1446050705823 ]
LOG: [ 'page-1', 1446050706327 ]
LOG: [ 'page-2', 1446050706834 ]
LOG: [ 'page-3', 1446050707334 ]
LOG: [ 'page-4', 1446050707839 ]
FINISHED: { pages: 5, total: 10, duration: 2520 }
```

##### Balanced Sequence Receiver

In the following example we have a [sequence] that returns data while the index is less than 5, and the
destination function that enforces a 1 second delay on processing each data resolved from the source.
 
```js 
const spex = require('spex')(Promise);

function source(index, data, delay) {
    console.log('SOURCE:', index, data, delay);
    if (index < 5) {
        return Promise.resolve(index);
    }
}

function dest(index, data, delay) {
    console.log('DEST:', index, data, delay);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, 1000);
    });
}

spex.sequence(source, {dest: dest})
    .then(data => {
        console.log('DATA:', data);
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

[page]:http://vitaly-t.github.io/spex/global.html#page
[sequence]:http://vitaly-t.github.io/spex/global.html#sequence
