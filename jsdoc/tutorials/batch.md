---

Consider executing a batch/array of promises within a temporary context:
  
* queries inside a database transaction
* logging a complete result into a file
* sending a whole package into a channel

Each time you are likely to open a receiving context, execute a batch of independent promises,
and then release the context. 

And while rejected promises may or may not be ignored, they often need to be finalized (settled)
in order to avoid execution against a released context.

The standard method `promise.all` isn't suitable in this case, because it does not guarantee to
settle all the values in the array. And while some libraries offer a separate method to settle
an array of promises, it becomes awkward to combine the logic into one meaningful result, and
certainly not without a loss in performance. 

And this is where method [batch] helps:

* It settles all of the promises in the array
* It resolves in the same way as `promise.all` when each value in the array resolves
* It rejects when any value in the array rejects, providing complete details
* It has additional diagnostics and results reporting features

### Examples

Let's start with a positive example, and throw in a few combinations of [mixed values].
 
```js
const spex = require('spex')(Promise);

// function that returns a promise;
function getWord() {
    return Promise.resolve('World');
}

// function that returns a value;
function getExcl() {
    return '!';
}

// function that returns another function;
function nested() {
    return getExcl;
}

const values = [
    123,
    'Hello',
    getWord,
    Promise.resolve(nested)
];

spex.batch(values)
    .then(data => {
        console.log('DATA:', data);
    })
    .catch(error => {
        console.log('ERROR:', error);
    });
```

This outputs:

```
DATA: [ 123, 'Hello', 'World', '!' ]
```

Now let's make it fail by changing `getWord` to this:

```js
function getWord() {
    return Promise.reject('World');
}
```

Now the output is:

```
ERROR: [ { success: true, result: 123 },
  { success: true, result: 'Hello' },
  { success: false, result: 'World' },
  { success: true, result: '!' } ]
```

i.e. the entire array is settled, reporting index-bound results. 

And if instead of reporting the entire reason we call `getErrors()`:

```js
console.log('ERROR:', reason.getErrors());
```

then the output will be:

```
ERROR: [ 'World' ]
```

This is just to simplify quick access to the list of errors that occurred.

[batch]:http://vitaly-t.github.io/spex/global.html#batch
[mixed values]:http://vitaly-t.github.io/spex/tutorial-mixed.html

