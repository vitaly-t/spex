## Linked and Detached Sequencing

#### Terminology

Elements in a *detached sequence* are created without any dependency between them.

In a *linked sequence* elements are created with one or both of the dependencies:
  
* element's index in the sequence
* previous element in the sequence

Method [sequence] supports each of the three sequence variations.

#### Example

Let's create an academic example of a linked sequence that calculates primes from a previous result.

 ```javascript
function nextPrime(value) {
    if (value >= 2) {
        var found;
        do {
            var q = Math.floor(Math.sqrt(++value));
            for (var i = 2; i <= q; i++) {
                found = i;
                if (value % i === 0) {
                    found = 0;
                    break;
                }
            }
        } while (!found);
        return value;
    }
    return 2;
}
```

Building a sequence of the first 10 primes directly:

```javascript
var value, result = [];
for (var i = 0; i < 10; i++) {
    value = nextPrime(value);
    result.push(value);
}
console.log("Result:", result);
```

we get the following output:

```javascript
Result: [ 2, 5, 7, 11, 13, 17, 19, 23, 29, 31 ]
```

Now let's create the same sequence using spex:

```javascript
function source(idx, data) {
    return nextPrime(data);
}

spex.sequence(source, null, 10, true)
    .then(function (data) {
        console.log("Result:", data);
    });
```

It will produce the identical output as before:

```javascript
Result: [ 2, 5, 7, 11, 13, 17, 19, 23, 29, 31 ]
```

#### Benchmarks

In the example above our `source` function returns a number directly, but it can be any [mixed value].

Let's benchmark how the spex [sequence] performs compared to the direct calculation as we increase
the size of the sequence.

```javascript
function source(idx, data) {
    return Promise.resolve(nextPrime(data));
}
```

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
    <td>0</td>
    <td>0</td>
    <td>1</td>
    <td>31</td>
    <td>1,008</td>
    <td>17,556</td>
   </tr>
   <tr>
    <td>number</td>
    <td>0 / 0</td>
    <td>0 / 0</td>
    <td>2 / 2</td>
    <td>27 / 20</td>
    <td>485 / 406</td>
    <td>11,984 / 11,080</td>
   </tr>
   <tr>
    <td>promise</td>
    <td>0 / 0</td>
    <td>1 / 1</td>
    <td>2 / 2</td>
    <td>28 / 20</td>
    <td>490 / 430</td>
    <td>12,140 / 11,890</td>
   </tr>   
</table>

* `direct` - direct sequence calculation;
* `number` - using [sequence] with the `source` that returns numbers;
* `promise` - using [sequence] with the `source` that returns promises; 
* All values are given in milliseconds;
* Two measurements for the [sequence]: ES6 Promise / Bluebird
* Measured under NodeJS 4.1.1, 64-bit, with i7-4770 CPU

[mixed value]:https://github.com/vitaly-t/spex/wiki/Mixed-Values
[sequence]:https://github.com/vitaly-t/spex/blob/master/docs/code/sequence.md
[Bluebird]:https://github.com/petkaantonov/bluebird
