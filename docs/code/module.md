<a name="module_spex"></a>
## spex ⇒ <code>Object</code>
**Summary**: Specialized Promise Extensions  

---
Attaches to an external promise library and provides additional methods built solelyon the basic promise operations: - construct a new promise with a callback function - resolve a promise with some result data - reject a promise with a reason### usageFor any third-party promise library:```jsvar promise = require('bluebird');var spex = require('spex')(promise);```For ES6 promises:```jsvar spex = require('spex')(Promise);```

### Parameters
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>promiseLib</td><td><code>Object</code> | <code>function</code></td><td><p>Instance of a promise library to be used by this module.</p>
<p>Some implementations use <code>Promise</code> constructor to create a new promise, while
others use the module&#39;s function for it. Both types are supported the same.</p>
<p>Alternatively, an object of type <a href="#module_spex..PromiseAdapter">PromiseAdapter</a>
can be passed in, which provides compatibility with any promise library outside of the standard.</p>
<p>Passing in a promise library that cannot be recognized will throw
<code>Invalid promise library specified.</code></p>
</td>
    </tr>  </tbody>
</table>

**Returns**: <code>Object</code> - Namespace with all supported methods.  
**See**: <a href="batch.md">batch</a>, <a href="page.md">page</a>, <a href="sequence.md">sequence</a>, <a href="https://github.com/vitaly-t/spex/blob/master/docs/concept/stream.md">stream</a>  

* [spex](#module_spex) ⇒ <code>Object</code>
  * [~PromiseAdapter](#module_spex..PromiseAdapter)
    * [new PromiseAdapter(create, resolve, reject)](#new_module_spex..PromiseAdapter_new)

<a name="module_spex..PromiseAdapter"></a>
### spex~PromiseAdapter
**Summary**: Adapter for the primary promise operations.  

---
### Parameters
<a name="new_module_spex..PromiseAdapter_new"></a>
#### new PromiseAdapter(create, resolve, reject)

---
Provides compatibility with promise libraries that are not <a href="https://promisesaplus.com">Promises/A+</a> compliant,via functions that implement the primary operations with promises: - construct a new promise with a callback function - resolve a promise with some result data - reject a promise with a reasonBelow is an example of setting up an adapter for AngularJS $q:```jsvar spexLib = require('spex');var adapter = new spexLib.PromiseAdapter(   function (cb) {       return $q(cb); // creating a new promise;   }, function (data) {       return $q.when(data); // resolving a promise;   }, function (reason) {       return $q.reject(reason); // rejecting a promise;   });var spex = spexLib(adapter);```

### Parameters
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>create</td><td><code>function</code></td><td><p>A function that takes a callback parameter and returns a new promise object.
The callback parameter is expected to be <code>function(resolve, reject)</code>.</p>
<p>Passing in anything other than a function will throw <code>Adapter requires a function to create a promise.</code></p>
</td>
    </tr><tr>
    <td>resolve</td><td><code>function</code></td><td><p>A function that takes an optional data parameter and resolves a promise with it.</p>
<p>Passing in anything other than a function will throw <code>Adapter requires a function to resolve a promise.</code></p>
</td>
    </tr><tr>
    <td>reject</td><td><code>function</code></td><td><p>A function that takes an optional error parameter and rejects a promise with it.</p>
<p>Passing in anything other than a function will throw <code>Adapter requires a function to reject a promise.</code></p>
</td>
    </tr>  </tbody>
</table>

