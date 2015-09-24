<a name="page"></a>
## page(source, [dest], [limit]) ⇒ <code>Promise</code>
Acquires pages (arrays of <a href="https://github.com/vitaly-t/spex/wiki/Mixed-Values">mixed values</a>) from the source function, one by one,and resolves each page as a <a href="batch.md">batch</a>, till no more pages left or an error/reject occurs.

**Kind**: global function  
**Summary**: Resolves a dynamic sequence of arrays/pages with <a href="https://github.com/vitaly-t/spex/wiki/Mixed-Values">mixed values</a>.  
**Returns**: <code>Promise</code> - When successful, the method resolves with object `{pages, total, duration}`: - `pages` = number of pages resolved - `total` = the sum of all page sizes (total number of values resolved) - `duration` = number of milliseconds consumed by the methodWhen the method fails, there are two types of rejects that may occur: - *Normal Reject*: when one of the pages failed to resolve as a <a href="batch.md">batch</a> - *Processing Reject*: caused by either the `source` or the `dest` functions*Normal Rejects* provide object `{index, data}`: - `index` = index of the page rejected by method <a href="batch.md">batch</a> - `data` = the rejection data from method <a href="batch.md">batch</a>*Processing Rejects* provide object `{index, error, [source], [dest]}`: - `index` = index of the page for which an error/reject occurred - `error` = the error thrown or the rejection reason - `source` - optionally set, if caused by the `source` function (see `source` parameter) - `dest` - optionally set, if caused by the `dest` function (see `dest` parameter)Object for both reject types has method `getError()` to simplify access to the error.For *Normal Rejects* it will return `data.getErrors()[0]` (see method <a href="batch.md">batch</a>),and `error` value for the *Processing Rejects*.  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>source</td><td><code>function</code></td><td></td><td><p>Expected to return a <a href="https://github.com/vitaly-t/spex/wiki/Mixed-Values">mixed value</a> that resolves with either <code>undefined</code> or the
next page of data (array of <a href="https://github.com/vitaly-t/spex/wiki/Mixed-Values">mixed values</a>) to be resolved. If the returned value
resolves into <code>undefined</code> or an empty array, it signals the end of the sequence,
and the method resolves.</p>
<p>The function is called with the same <code>this</code> context as the calling method.</p>
<p>Parameters:</p>
<ul>
<li><code>index</code> = index of the page being requested</li>
<li><code>data</code> = previously returned page, resolved as a <a href="batch.md">batch</a>, <code>undefined</code> when <code>index=0</code></li>
</ul>
<p>If the returned <a href="https://github.com/vitaly-t/spex/wiki/Mixed-Values">mixed value</a> resolves into anything other than an array or <code>undefined</code>,
the method will reject with object <code>{index, error}</code>:</p>
<ul>
<li><code>index</code> = index of the page for which the request failed</li>
<li><code>error</code> = <code>Unexpected data returned from the source.</code></li>
</ul>
<p>If the function throws an error or returns a rejected promise, the sequence terminates,
and the method rejects with object <code>{index, error, source}</code>:</p>
<ul>
<li><code>index</code> = index of the request that failed</li>
<li><code>error</code> = the error thrown or the rejection reason</li>
<li><code>source</code> = resolved <code>data</code> that was passed into the function</li>
</ul>
<p>Passing in anything other than a function will throw <code>Invalid page source.</code></p>
</td>
    </tr><tr>
    <td>[dest]</td><td><code>function</code></td><td></td><td><p>Optional destination function (notification callback), to receive resolved <a href="batch.md">batch</a> of data
for each page, process it and respond as required.</p>
<p>Parameters:</p>
<ul>
<li><code>index</code> = page index in the sequence</li>
<li><code>data</code> = page data resolved as a <a href="batch.md">batch</a></li>
</ul>
<p>The function is called with the same <code>this</code> context as the calling method.</p>
<p>It can optionally return a promise object, if notifications are handled asynchronously.
And if a promise is returned, the method will not request the next page from the <code>source</code>
function until the promise has been resolved.</p>
<p>If the function throws an error or returns a promise that rejects, the sequence terminates,
and the method rejects with object <code>{index, error, dest}</code>:</p>
<ul>
<li><code>index</code> = index of the page passed into the function</li>
<li><code>error</code> = the error thrown or the rejection reason</li>
<li><code>dest</code> = resolved <a href="batch.md">batch</a> that was passed into the function</li>
</ul>
<p>Passing in a non-empty value other than a function will throw <code>Invalid page destination.</code></p>
</td>
    </tr><tr>
    <td>[limit]</td><td><code>Integer</code></td><td><code>0</code></td><td><p>Limits the maximum number of pages to be requested from the <code>source</code>. If the value is an
integer greater than 0, the method will successfully resolve once the specified limit has
been reached.</p>
<p>By default, the sequence is unlimited, and will continue till the <code>source</code> function returns
<code>undefined</code> or an empty array, or when an error/reject occurs.</p>
</td>
    </tr>  </tbody>
</table>

