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

---
### Parameters
<a name="new_module_spex..PromiseAdapter_new"></a>
#### new PromiseAdapter(create, resolve, reject)

---
### Parameters
<table>
  <thead>
    <tr>
      <th>Param</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>create</td>
    </tr><tr>
    <td>resolve</td>
    </tr><tr>
    <td>reject</td>
    </tr>  </tbody>
</table>

