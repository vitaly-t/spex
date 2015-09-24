<a name="module_spex"></a>
## spex ⇒ <code>Object</code>
Attaches to an external promise library to provide additional methods built solelyon the basic promise operations: - construct a new promise with a callback function - resolve a promise with result data - reject a promise with a reason## usageFor third-party promise libraries:```jsvar promise = require('bluebird');var spex = require('spex')(promise);```For ES6 promises:```jsvar spex = require('spex')(Promise);```

**Summary**: Specialized Promise Extensions  
**Returns**: <code>Object</code> - Namespace with all supported methods.  
**See**: <a href="batch.md">batch</a>, <a href="page.md">page</a>, <a href="sequence.md">sequence</a>  
**Author:** Vitaly Tomilov  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>promiseLib</td><td><code>Object</code> | <code>function</code></td><td><p>Instance of a promise library to be used by this module.</p>
<p>Some implementations expose the standard <code>Promise</code> constructor, like <a href="https://github.com/petkaantonov/bluebird">Bluebird</a>, <a href="https://github.com/cujojs/when">When</a>, <a href="https://github.com/kriskowal/q">Q</a>,
while others use the module&#39;s main function for the same, like <a href="https://github.com/then/promise">Promise</a> and <a href="https://github.com/calvinmetcalf/lie">Lie</a>. Both types
are supported and initialized in the same way.</p>
<p>If the parameter isn&#39;t recognized as a promise library, the method will throw
<code>Invalid promise library specified.</code></p>
</td>
    </tr><tr>
    <td>[options]</td><td><code>Object</code></td><td><p>Optional configuration object with properties - options.</p>
<p>Not used in the current version of the library.</p>
</td>
    </tr>  </tbody>
</table>

