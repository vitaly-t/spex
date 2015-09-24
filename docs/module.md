<a name="module_spex"></a>
## spex ⇒ <code>Object</code>
**Summary**: Specialized Promise Extensions  

---
Attaches to an external promise library to provide additional methods built solelyon the basic promise operations: - construct a new promise with a callback function - resolve a promise with result data - reject a promise with a reason## usageFor third-party promise libraries:```jsvar promise = require('bluebird');var spex = require('spex')(promise);```For ES6 promises:```jsvar spex = require('spex')(Promise);```

## Parameters
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
others use the module&#39;s function for it. The two types are supported the same.</p>
<p>Passing in a promise library that cannot be recognized will throw
<code>Invalid promise library specified.</code></p>
</td>
    </tr><tr>
    <td>[options]</td><td><code>Object</code></td><td><p>Optional configuration object with properties - options.</p>
<p>Not used in the current version of the library.</p>
</td>
    </tr>  </tbody>
</table>

**Returns**: <code>Object</code> - Namespace with all supported methods.  
