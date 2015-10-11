## Streaming and Paging

In the most generic terms, data streaming is copying data from a source/provider and into a destination/recipient. 

In the world of promises this can be formulated as acquiring promises from a source, resolving them and passing
the result into a destination handler for processing or as a notification.

And this is one of the things that methods [page] and [sequence] can do - resolving and tunnelling data through.
The two methods can handle both limited and infinite streams, and they can stream data either one-by-one (method [sequence])
or in packages/batches (method [page]).

#### Examples

Below is a simple track-enabled sequence that creates and returns promises one by one.
It also includes a destination function for logging purposes.

```javascript
var spex = require('spex')(Promise);

function source(idx, data, delay) {
    // create and return a promise objects dynamically,
    // based on the index of the sequence (parameter idx);
    switch (idx) {
        case 0:
            return Promise.resolve('zero');
        case 1:
            return Promise.resolve('one');
        case 2:
            return Promise.resolve('two');
        case 3:
            return Promise.resolve('three');
    }
    // returning nothing/undefined indicates the end of the sequence;
    // throwing an error will result in a reject;
}

function dest(idx, data, delay) {
    console.log("LOG:", idx, data, delay);
}

spex.sequence(source, dest, 0, true)
    .then(function (data) {
        console.log("DATA:", data); // print result;
    });
```

Output:
```
LOG: 0 zero undefined
LOG: 1 one 8
LOG: 2 two 1
LOG: 3 three 0
DATA: [ 'zero', 'one', 'two', 'three' ]
```

[page]:https://github.com/vitaly-t/spex/blob/master/docs/code/page.md
[sequence]:https://github.com/vitaly-t/spex/blob/master/docs/code/sequence.md
