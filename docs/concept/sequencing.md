# Linked and Detached Sequencing

### Terminology

Elements in a *detached sequence* are created without any dependency between them.

In a *linked sequence* elements are created with one or both of the dependency types:
  
* element's index in the sequence
* previous element in the sequence

Method [sequence] supports each of the three sequence variations.

### Example

Let's implement a linked sequence that calculates primes from the previous result.

```javascript
function nextPrime(value) {
    if (value > 2) {
        var i, q;
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

```javascript
var value, result = [];
for (var i = 0; i < 10; i++) {
    value = nextPrime(value);
    result.push(value);
}
console.log('Result:', result);
```

we get the following output:

```javascript
Result: [ 2, 3, 5, 7, 11, 13, 17, 19, 23, 29 ]
```

Now let's create the same sequence using spex:

```javascript
function source(index, data) {
    return nextPrime(data);
}

spex.sequence(source, {limit: 10, track: true})
    .then(function (data) {
        console.log('Result:', data);
    });
```

It will produce the identical output as before:

```javascript
Result: [ 2, 3, 5, 7, 11, 13, 17, 19, 23, 29 ]
```

### Benchmarks

In the example above our `source` function returns a number directly, but it can be any [mixed value].

Let's see how the [sequence] performs compared to the direct calculation as we increase the sequence size.

<table>
   <tr>
    <th></th>
    <th>10</th>
    <th>100</th>
    <th>1,000</th>
    <th>10,000</th>
    <th>100,000</th>
    <th>1,000,000</th>
   </tr>
   <tr>
    <td>direct</td>
    <td>0.00</td>
    <td>0.00</td>
    <td>0.14</td>
    <td>4.56</td>
    <td>143</td>
    <td>4,650</td>
   </tr>
   <tr>
    <td>number</td>
    <td>0.02 / 0.02</td>
    <td>0.18 / 0.12</td>
    <td>1.89 / 1.08</td>
    <td>22.5 / 13.8</td>
    <td>306 / 227</td>
    <td>5,985 / 5,192</td>
   </tr>
   <tr>
    <td>promise</td>
    <td>0.02 / 0.01</td>
    <td>0.17 / 0.11</td>
    <td>1.85 / 1.08</td>
    <td>21.5 / 13.7</td>
    <td>306 / 228</td>
    <td>5,990 / 5,172</td>
   </tr>   
</table>

* `direct` - direct sequence calculation;
* `number` - using [sequence] with the `source` that returns numbers:
```javascript
function source(index, data) {
    return nextPrime(data);
}
```
* `promise` - using [sequence] with the `source` that returns promises:
```javascript
function source(index, data) {
    return Promise.resolve(nextPrime(data));
}
```
* All values are given in milliseconds;
* Two measurements for the [sequence]: ES6 Promise / Bluebird
* Measured under NodeJS 4.1.1, 64-bit, with i7-4770 @ 3.85GHz

[mixed value]:https://github.com/vitaly-t/spex/wiki/Mixed-Values
[sequence]:https://github.com/vitaly-t/spex/blob/master/docs/code/sequence.md
[Bluebird]:https://github.com/petkaantonov/bluebird
