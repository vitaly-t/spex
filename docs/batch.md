<a name="batch"></a>
## batch(values, [cb]) ⇒ <code>Promise</code>
Settles every <a href="https://github.com/vitaly-t/spex/wiki/Mixed-Values">mixed value</a> in the input array, and resolves with the array ofresults, if all values resolved, or rejects when one or more values rejected.This method is a fusion of `promise.all` + `promise.settle` logic, to resolve withthe same type of result as the standard `promise.all`, while also settling all the promises,and providing a comprehensive rejection summary in case of any reject.

**Kind**: global function  
**Summary**: Resolves a predefined array of <a href="https://github.com/vitaly-t/spex/wiki/Mixed-Values">mixed values</a>.  
**Returns**: <code>Promise</code> - Result for the entire batch, which resolves when every value in the input array has been resolved,and rejects when: - one or more values in the array rejected - one or more calls into the notification callback returned a rejected promise or threw an errorThe method resolves with an array of individual resolved results, the same as `promise.all`.In addition, the array is extended with read-only property `duration` - number of millisecondstaken to resolve all the data.When failed, the method rejects with an array of objects `{success, result}`: - `success`: `true/false`, indicates whether the corresponding value in the input array was resolved. - `result`: resolved data, if `success=true`, or else the rejection reason.In addition, the array is extended with function `getErrors`, which returns the list of just errors,with support for nested batch results. Calling `getErrors()[0]`, for example, will get the sameresult as the rejection reason that `promise.all` would provide.When a value in the array represents a failure that's the result of an unsuccessful call into thenotification callback, it will also have property `origin`. See documentation for parameter `cb`.In both cases the output array is always the same size as the input one, providing index mappingbetween input and output values.  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>values</td><td><code>Array</code></td><td><p>Array of <a href="https://github.com/vitaly-t/spex/wiki/Mixed-Values">mixed values</a> to be resolved asynchronously, i.e. in no particular order.</p>
<p>If the parameter is anything other than an array, an error is thrown:
<code>Array of values is required to execute a batch.</code></p>
</td>
    </tr><tr>
    <td>[cb]</td><td><code>function</code></td><td><p>Optional callback to receive a notification about the resolution result for each value.</p>
<p>Parameters:</p>
<ul>
<li><code>index</code> - index of the value in the array</li>
<li><code>success</code> - indicates whether the value was resolved (<code>true</code>), or rejected (<code>false</code>)</li>
<li><code>data</code> - resolved data, if <code>success</code>=<code>true</code>, or else the rejection reason</li>
</ul>
<p>The function is called with the same <code>this</code> context as the calling method.</p>
<p>It can optionally return a promise object, to indicate that it handles notifications asynchronously.
If the returned promise resolves, it signals a successful notification, while any resolved data is ignored.</p>
<p>If the function returns a rejected promise or throws an error, the entire method rejects, while the
rejected element is replaced with object <code>{success, result, origin}</code>:</p>
<ul>
<li><code>success</code> = <code>false</code></li>
<li><code>result</code> - the rejection reason or the error thrown by the notification callback</li>
<li><code>origin</code> - the original data passed into the callback, as object <code>{success, result}</code></li>
</ul>
</td>
    </tr>  </tbody>
</table>

