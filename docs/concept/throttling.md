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

[page]:https://github.com/vitaly-t/spex/blob/master/docs/code/page.md
[sequence]:https://github.com/vitaly-t/spex/blob/master/docs/code/sequence.md

#### Examples

**Balanced Receiver**

In the example below we have a sequence that returns data while the index is less than 5, and the destination
function that enforces 1 second delay on processing each data resolved from the source.
 
```javascript 
var spex = require('spex')(Promise);
 
function source(index, data) {
    console.log("SOURCE:", index, data);
    if (index < 5) {
        return Promise.resolve(index);
    }
}
 
function dest(index, data) {
    console.log("DEST:", index, data);
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
SOURCE: 0 undefined
DEST: 0 0
SOURCE: 1 0
DEST: 1 1
SOURCE: 2 1
DEST: 2 2
SOURCE: 3 2
DEST: 3 3
SOURCE: 4 3
DEST: 4 4
SOURCE: 5 4
DATA: { total: 5, duration: 5012 }
```
