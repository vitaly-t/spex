## Modules
<dl>
<dt><a href="#module_spex">spex</a></dt>
<dd><p>Specialized Promise Extensions</p>
</dd>
</dl>
## Functions
<dl>
<dt><a href="#batch">batch(values, [cb])</a> ⇒ <code>Promise</code></dt>
<dd><p>Settles every <a href="https://github.com/vitaly-t/spex/wiki/Mixed-Values">mixed value</a> in the input array, and resolves with the array of
results, if all values resolved, or rejects when one or more values rejected.</p>
<p>This method is a fusion of <code>promise.all</code> + <code>promise.settle</code> logic, to resolve with
the same type of result as <code>promise.all</code>, while also settling all the promises, and
providing a comprehensive rejection summary in case any of the promises rejects.</p>
</dd>
<dt><a href="#page">page(source, [dest], [limit])</a></dt>
<dd></dd>
<dt><a href="#sequence">sequence(source, [dest], [limit], [track])</a> ⇒ <code>Promise</code></dt>
<dd><p>Acquires <a href="https://github.com/vitaly-t/spex/wiki/Mixed-Values">mixed values</a> from the source function, one at a time, and resolves them,
till either no more values left in the sequence or an error occurs.</p>
</dd>
</dl>
<a name="module_spex"></a>
## spex
Specialized Promise Extensions

**Author:** Vitaly Tomilov  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>promiseLib</td><td><code>Object</code> | <code>function</code></td>
    </tr><tr>
    <td>options</td><td><code>Object</code></td>
    </tr>  </tbody>
</table>

<a name="batch"></a>
## batch(values, [cb]) ⇒ <code>Promise</code>
Settles every <a href="https://github.com/vitaly-t/spex/wiki/Mixed-Values">mixed value</a> in the input array, and resolves with the array ofresults, if all values resolved, or rejects when one or more values rejected.This method is a fusion of `promise.all` + `promise.settle` logic, to resolve withthe same type of result as `promise.all`, while also settling all the promises, andproviding a comprehensive rejection summary in case any of the promises rejects.

**Kind**: global function  
**Summary**: Resolves a predefined array of <a href="https://github.com/vitaly-t/spex/wiki/Mixed-Values">mixed values</a>.  
**Returns**: <code>Promise</code> - Result for the entire batch, which resolves when every value in the input array has been resolved,and rejects when: - one or more values in the array rejected - one or more calls into the notification callback returned a rejected promise or threw an errorThe method resolves with an array of individual resolved results, the same as `promise.all`.In addition, the array is extended with read-only property `duration` - number of millisecondstaken to resolve all the data.When failed, the method rejects with an array of objects `{success, result}`: - `success`: `true/false`, indicates whether the corresponding value in the input array was resolved. - `result`: resolved data, if `success=true`, or else the rejection reason.In addition, the array is extended with function `getErrors`, which returns the list of just errors,with support for nested batch results. Calling `getErrors()[0]`, for example, will get the sameresult as the rejection reason that `promise.all` would provide.When a value in the array represents a failure that's the result of an unsuccessful call into thenotification callback, it also has property `origin`. See documentation for `cb` parameter.In both cases the output array is always the same size as the input one, providing index mappingbetween input and output values.  
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

<a name="page"></a>
## page(source, [dest], [limit])
**Kind**: global function  
**Summary**: Resolves dynamic arrays/pages of promises;  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>source</td><td><code>function</code></td><td></td>
    </tr><tr>
    <td>[dest]</td><td><code>function</code></td><td></td>
    </tr><tr>
    <td>[limit]</td><td><code>function</code></td><td><code>0</code></td>
    </tr>  </tbody>
</table>

<a name="sequence"></a>
## sequence(source, [dest], [limit], [track]) ⇒ <code>Promise</code>
Acquires <a href="https://github.com/vitaly-t/spex/wiki/Mixed-Values">mixed values</a> from the source function, one at a time, and resolves them,till either no more values left in the sequence or an error occurs.

**Kind**: global function  
**Summary**: Resolves a dynamic sequence of <a href="https://github.com/vitaly-t/spex/wiki/Mixed-Values">mixed values</a>.  
**Returns**: <code>Promise</code> - When successful, the resolved data depends on parameter `track`. When `track` is `false`(default), the method resolves with object `{total, duration}`: - `total` - total number of values resolved from the sequence - `duration` - number of milliseconds consumed by the methodWhen `track` is `true`, the method resolves with an array of all the data that has been resolved,the same way that the standard `promise.all` resolves. In addition, the array comes extended withread-only property `duration` - number of milliseconds consumed by the method.If the method fails, it rejects with an object according to which function causedthe failure - `source` or `dest`. See the two parameters for the rejection details.  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>source</td><td><code>function</code></td><td></td><td><p>Expected to return the next <a href="https://github.com/vitaly-t/spex/wiki/Mixed-Values">mixed value</a> to be resolved. When the function
returns nothing (<code>undefined</code>), it indicates the end of the sequence.</p>
<p>Parameters:</p>
<ul>
<li><code>index</code> - current request index in the sequence;</li>
<li><code>data</code> - resolved data from the previous call to the function (<code>undefined</code>
for the initial call).</li>
</ul>
<p>The function is called with the same <code>this</code> context as the calling method.</p>
<p>If the function throws an error or returns a rejected promise, the sequence terminates,
and the method rejects with object <code>{index, error, source}</code>:</p>
<ul>
<li><code>index</code> - index of the request that failed</li>
<li><code>error</code> - the error thrown or the reject reason</li>
<li><code>source</code> - resolved <code>data</code> that was passed into the function</li>
</ul>
<p>Passing in anything other than a function will throw <code>Invalid sequence source.</code></p>
</td>
    </tr><tr>
    <td>[dest]</td><td><code>function</code></td><td></td><td><p>Optional destination function (notification callback), to receive resolved data for each index,
process it and respond as required.</p>
<p>Parameters:</p>
<ul>
<li><code>index</code> - index of the resolved data in the sequence</li>
<li><code>data</code> - the data resolved</li>
</ul>
<p>The function is called with the same <code>this</code> context as the calling method.</p>
<p>It can optionally return a promise object, if data processing is done asynchronously.
If a promise is returned, the method will not request the next value from the <code>source</code> function,
until the promise has been resolved.</p>
<p>If the function throws an error or returns a promise that rejects, the sequence terminates,
and the method rejects with object <code>{index, error, dest}</code>:</p>
<ul>
<li><code>index</code> - index of the data that was processed</li>
<li><code>error</code> - the error thrown or the reject reason</li>
<li><code>dest</code> - resolved data that was passed into the function</li>
</ul>
<p>Passing in a non-empty value other than a function will throw <code>Invalid sequence destination.</code></p>
</td>
    </tr><tr>
    <td>[limit]</td><td><code>Integer</code></td><td><code>0</code></td><td><p>Limits the maximum size of the sequence. If the value is an integer greater than 0,
the method will successfully resolve once the specified limit has been reached.
By default, the sequence is unlimited, and will continue till either <code>source</code> function
returns <code>undefined</code> or an error/reject occurs.</p>
</td>
    </tr><tr>
    <td>[track]</td><td><code>Boolean</code></td><td><code>false</code></td><td><p>This parameter changes the type of data to be resolved by this method.
By default, it is <code>false</code> (see the return result).
When set to be <code>true</code>, it instructs the method to track/collect all resolved data into
an array internally, so it can be resolved with once the method has finished successfully.</p>
<p>It must be used with caution, as to the size of the sequence, because accumulating data for
a very large sequence can result in consuming too much memory.</p>
</td>
    </tr>  </tbody>
</table>

