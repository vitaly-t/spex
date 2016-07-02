---

A mixed / pseudo value is one of the three types listed below, to be resolved into:
* an actual value, if successful
* an error, if the resolution fails

### 1. Actual Value

Anything other than a function or a promise. The value is resolved with immediately.

### 2. Function

Expected to return the actual value. If it returns again a function or a promise, the resolution attempt will continue.

If the function throws an error, the value is rejected with that error.

Functions on all levels receive the same `this` context and the list of parameters as provided by the original caller.

If the function is an ES6 generator, it is converted into a promise and then processed accordingly.

### 3. Promise

To resolve with the data that represents the actual value. If it resolves again with a promise or a function, the resolution attempt will continue.

A rejected promise becomes a rejected value, with the same reason specified.

