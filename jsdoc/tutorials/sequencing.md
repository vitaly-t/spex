---

### Terminology

Elements in a *detached sequence* are created without any dependency between them.

In a *linked sequence* elements are created with one or both of the dependency types:
  
* element's index in the sequence
* previous element in the sequence

Method [sequence] supports each of the three sequence variations.

### Example

Let's implement a linked sequence that calculates primes from the previous result.

```js
function nextPrime(value) {
    if (value > 2) {
        let i, q;
        do {
            i = 3;
            value += 2;
            q = Math.floor(Math.sqrt(value));
            while (i <= q && value % i) {
                i += 2;
            }
        } while (i <= q);
        return value;
    }
    return value === 2 ? 3 : 2;
}
```

Building a sequence of the first 10 primes directly:

```js
const result = [];
let value;
for (let i = 0; i < 10; i++) {
    value = nextPrime(value);
    result.push(value);
}
console.log('Result:', result);
```

we get the following output:

```js
Result: [ 2, 3, 5, 7, 11, 13, 17, 19, 23, 29 ]
```

Now let's create the same sequence using spex:

```js
function source(index, data) {
    return nextPrime(data);
}

spex.sequence(source, {limit: 10, track: true})
    .then(data => {
        console.log('Result:', data);
    });
```

It will produce the identical output as before:

```js
Result: [ 2, 3, 5, 7, 11, 13, 17, 19, 23, 29 ]
```

### Benchmarks

In the example above our `source` function returns a number directly, but it can be any [mixed value].

Let's see how the [sequence] performs compared to the direct calculation as we increase the sequence size.

|          |10	      |100     |1,000     |10,000    |100,000	|1,000,000
|:--------:|:--------:|:-------:|:-------:|:--------:|:--------:|:------:|
|**direct**	   |0.00	|0.00	|0.14	|4.56	|143	|4,650
|**number**	   |&nbsp;&nbsp;0.02/0.02 |&nbsp;&nbsp;0.18/0.12|&nbsp;&nbsp;1.89/1.08|&nbsp;&nbsp;22.5/13.8|&nbsp;&nbsp;306/227|&nbsp;&nbsp;5,985/5,192
|**promise**   |&nbsp;&nbsp;0.02/0.01|&nbsp;&nbsp;0.17/0.11	|&nbsp;&nbsp;1.85/1.08|&nbsp;&nbsp;21.5/13.7|&nbsp;&nbsp;306/228|&nbsp;&nbsp;5,990/5,172

* `direct` - direct sequence calculation;
* `number` - using [sequence] with the `source` that returns numbers:

```js
function source(index, data) {
    return nextPrime(data);
}
```

* `promise` - using [sequence] with the `source` that returns promises:

```js
function source(index, data) {
    return Promise.resolve(nextPrime(data));
}
```
* All values are given in milliseconds;
* Two measurements for the [sequence]: ES6 Promise / Bluebird
* Measured under NodeJS 4.1.1, 64-bit, with i7-4770 @ 3.85GHz

[mixed value]:http://vitaly-t.github.io/spex/tutorial-mixed.html
[sequence]:http://vitaly-t.github.io/spex/global.html#sequence
[Bluebird]:https://github.com/petkaantonov/bluebird
