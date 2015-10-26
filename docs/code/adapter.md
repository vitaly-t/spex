<a name="PromiseAdapter"></a>
## PromiseAdapter
**Summary**: Adapter for the primary promise operations.  

---
### Parameters
<a name="new_PromiseAdapter_new"></a>
### new PromiseAdapter(create, resolve, reject)

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

