## Modules
<dl>
<dt><a href="#module_spex">spex</a></dt>
<dd><p>Specialized Promise Extensions</p>
</dd>
</dl>
## Functions
<dl>
<dt><a href="#batch">batch(values, [cb])</a> ⇒ <code>Promise</code></dt>
<dd><p>This method is a fusion of <code>promise.all</code> + <code>promise.settle</code> logic,
to resolve with the same type of result as <code>promise.all</code>, while also
settling all the promises, and providing a detailed summary in case
any of the promises rejects.</p>
</dd>
<dt><a href="#chain">chain(source)</a></dt>
<dd></dd>
<dt><a href="#page">page(source, [dest])</a></dt>
<dd></dd>
<dt><a href="#sequence">sequence(factory, [noTracking], [cb])</a> ⇒ <code>Promise</code></dt>
<dd></dd>
<dt><a href="#stream">stream(source, [dest])</a></dt>
<dd><p>Acquires promise objects dynamically from the source function, resolves them,
and passes the result into the destination function.</p>
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
This method is a fusion of `promise.all` + `promise.settle` logic,to resolve with the same type of result as `promise.all`, while alsosettling all the promises, and providing a detailed summary in caseany of the promises rejects.

**Kind**: global function  
**Summary**: Attempts to resolve every value in the input array.  
**Returns**: <code>Promise</code> - Result for the entire batch, which resolves whenevery promise in the input array has been resolved, and rejects when oneor more promise objects in the array rejected:- resolves with an array of individual resolved results, the same as `promise.all`;  The array comes extended with read-only property `duration` - number of  milliseconds taken to resolve all the data.- rejects with an array of objects `{success, result}`:  - `success`: `true/false`, indicates whether the corresponding value    in the input array was resolved.  - `result`: resolved data, if `success=true`, or else the rejection reason.  The array comes extended with function `getErrors`, which returns the list  of just errors, with support for nested batch results.  Calling `getErrors()[0]`, for example, will get the same result as the  rejection reason that `promise.all` would provide.In both cases the output array is always the same size as the input one,providing index mapping between input and output values.  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>values</td><td><code>Array</code></td><td><p>array of values of the following types:</p>
<ul>
<li>a simple value or object, to resolve with by default;</li>
<li>a promise object to be either resolved or rejected;</li>
<li>a function, to be called with the task/transaction context,
so it can return a value, an object or a promise.
If it returns another function, the call will be repeated,
until the returned type is a value, an object or a promise.</li>
</ul>
<p>If the parameter is anything other than an array, an error will
be thrown: <code>Array of values is required to execute a batch.</code></p>
</td>
    </tr><tr>
    <td>[cb]</td><td><code>function</code></td><td></td>
    </tr>  </tbody>
</table>

<a name="chain"></a>
## chain(source)
**Kind**: global function  
**Summary**: Resolves a linked sequence of dynamic promises.  
<table>
  <thead>
    <tr>
      <th>Param</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>source</td>
    </tr>  </tbody>
</table>

<a name="page"></a>
## page(source, [dest])
**Kind**: global function  
**Summary**: Resolves dynamic arrays/pages of promises;  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>source</td><td><code>function</code></td>
    </tr><tr>
    <td>[dest]</td><td><code>function</code></td>
    </tr>  </tbody>
</table>

<a name="sequence"></a>
## sequence(factory, [noTracking], [cb]) ⇒ <code>Promise</code>
**Kind**: global function  
**Summary**: Resolves an independent sequence of dynamic promises until no data left.  
**Returns**: <code>Promise</code> - Result of the sequence, depending on `noTracking`:- resolves with an array of resolved data, if `noTracking = false`;- resolves with an integer - total number of resolved requests, if `noTracking = true`;- rejects with the reason when the factory function throws an error or returns a rejected promise.  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>factory</td><td><code>function</code></td><td></td><td><p>a callback function <code>(idx, t)</code> to create and return a new promise,
based on the request index passed. When the value is anything other than a function, an error
is thrown: <code>Invalid factory function specified.</code></p>
</td>
    </tr><tr>
    <td>[noTracking]</td><td><code>Boolean</code></td><td><code>false</code></td><td><p>when <code>true</code>, it prevents tracking resolved results from
individual query requests, to avoid memory overuse when processing massive data.</p>
</td>
    </tr><tr>
    <td>[cb]</td><td><code>function</code></td><td></td><td><p>notification callback with <code>(idx, data)</code>, for every request resolved.</p>
</td>
    </tr>  </tbody>
</table>

<a name="stream"></a>
## stream(source, [dest])
Acquires promise objects dynamically from the source function, resolves them,and passes the result into the destination function.

**Kind**: global function  
**Summary**: Resolves promises one-by-one from source to destination.  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>source</td><td><code>function</code></td>
    </tr><tr>
    <td>[dest]</td><td><code>function</code></td>
    </tr>  </tbody>
</table>

