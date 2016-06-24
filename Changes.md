List of changes
===============

This is to track all the changes made, so not to forget to update the documentation accordingly once the coding is finished.

1. All methods no longer throw TypeError, they reject with it instead.

2. Methods batch, page and sequence now do not reject with a custom object/value, only with a custom error!

3. Custom types changes also the format of the error:

* method `page` replaced `getError()` with property `error`;

---

**UPDATE:**

After pg-promise 4.8.0 was released, I need to review all the code here, to see whether I need to use InternalError anywhere,
to cater for the situations when invoking a callback results in the client do any of the following: `throw 0`, `throw undefined`,
`throw ''`. I need to make sure that those cases are handled properly by every method.

TODO: Almost certainly, I should remove the logic of ending the sequence when `undefined` is resolved with.
