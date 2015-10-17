<a name="batch"></a>
## batch(values, [cb]) ⇒ <code>Promise</code>
**Summary**: Resolves a predefined array of <a href="https://github.com/vitaly-t/spex/wiki/Mixed-Values">mixed values</a>.  

---
Settles (resolves or rejects) every <a href="https://github.com/vitaly-t/spex/wiki/Mixed-Values">mixed value</a> in the input array, and resolveswith an array of results, if all values have been resolved, or else rejects.This method resembles a fusion of `promise.all` + `promise.settle` logic, to resolve withthe same type of result as `promise.all`, while also settling all the promises, similar to`promise.settle`, adding comprehensive details in case of a reject.<img src="../images/batch.png" width="836px" height="210px" alt="batch">

### Parameters
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>values</td><td><code>Array</code></td><td><p>Array of <a href="https://github.com/vitaly-t/spex/wiki/Mixed-Values">mixed values</a>, to be resolved asynchronously, in no particular order.</p>
<p>Passing in anything other than an array will throw <code>Batch requires an array of values.</code></p>
</td>
    </tr><tr>
    <td>[cb]</td><td><code>function</code></td><td><p>Optional callback to receive the result for each settled value.</p>
<p>Parameters:</p>
<ul>
<li><code>index</code> = index of the value in the source array</li>
<li><code>success</code> - indicates whether the value was resolved (<code>true</code>), or rejected (<code>false</code>)</li>
<li><code>result</code> = resolved data, if <code>success</code>=<code>true</code>, or else the rejection reason</li>
<li><code>delay</code> = number of milliseconds since the last call (<code>undefined</code> when <code>index=0</code>)</li>
</ul>
<p>The function is called with the same <code>this</code> context as the calling method.</p>
<p>It can optionally return a promise to indicate that notifications are handled asynchronously.
And if the returned promise resolves, it signals a successful handling, while any resolved
data is ignored.</p>
<p>If the function returns a rejected promise or throws an error, the entire method rejects,
and the corresponding value in the rejected array is reported as <code>{success, result, origin}</code>:</p>
<ul>
<li><code>success</code> = <code>false</code></li>
<li><code>result</code> = the rejection reason or the error thrown by the notification callback</li>
<li><code>origin</code> = the original data passed into the callback, as object <code>{success, result}</code></li>
</ul>
</td>
    </tr>  </tbody>
</table>

**Returns**: <code>Promise</code> - Result for the entire batch, which resolves when every value in the input array has been resolved,and rejects when: - one or more values in the array rejected or threw an error while being resolved as a <a href="https://github.com/vitaly-t/spex/wiki/Mixed-Values">mixed value</a> - one or more calls into the notification callback returned a rejected promise or threw an errorThe method resolves with an array of individual resolved results, the same as `promise.all`.In addition, the array is extended with read-only property `duration` - number of millisecondstaken to resolve all the data.When failed, the method rejects with an array of objects `[{success, result, [origin]}]`: - `success` = `true/false`, indicates whether the corresponding value in the input array was resolved. - `result` = resolved data, if `success=true`, or else the rejection reason. - `origin` - set only when failed as a result of an unsuccessful call into the notification callback (see documentation for parameter `cb`)In addition, the rejection array is extended with function `getErrors`, which returns the list of justerrors, with support for nested batch results. Calling `getErrors()[0]`, for example, will get the sameresult as the rejection reason that `promise.all` would provide.In all cases, the output array is always the same size as the input one, providing index mappingbetween the input values and the results.  
