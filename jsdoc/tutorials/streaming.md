---

In generic terms, data streaming is copying data from a source/provider and into a destination/recipient. 

In the world of promises this can be formulated as acquiring promises from a source, resolving them and passing
the result into a destination handler for further processing.

And this is one of the things that methods [page] and [sequence] can do - resolving and tunnelling data through.
The two methods can handle both limited and infinite streams, and they can stream data either one-by-one (method [sequence])
or in bundles (method [page]).

### Examples

Below is a simple track-enabled sequence that creates and returns promises one by one.
It also includes a destination function for logging purposes.

```js
const spex = require('spex')(Promise);

function source(index, data, delay) {
    // create and return a promise objects dynamically,
    // based on the index of the sequence;
    switch (index) {
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

function dest(index, data, delay) {
    console.log('LOG:', index, data, delay);
}

spex.sequence(source, {dest: dest, track: true})
    .then(data => {
        console.log('DATA:', data); // print result;
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

And if we run the same sequence without tracking (default):

```js
spex.sequence(source, {dest: dest})
    .then(data => {
        console.log('DATA:', data); // print result;
    });
```

then the output will change to:
```
LOG: 0 zero undefined
LOG: 1 one 8
LOG: 2 two 1
LOG: 3 three 0
DATA: { total: 4, duration: 10 }
```

[page]:http://vitaly-t.github.io/spex/global.html#page
[sequence]:http://vitaly-t.github.io/spex/global.html#sequence
