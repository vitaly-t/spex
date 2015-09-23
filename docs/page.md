<a name="page"></a>
## page(source, [dest], [limit]) ⇒ <code>Promise</code>
Acquires pages (arrays of <a href="https://github.com/vitaly-t/spex/wiki/Mixed-Values">mixed values</a>) from the source function, one by one,and resolves each page as a <a href="batch.md">batch</a>, till no more pages left or an error occurs.

**Kind**: global function  
**Summary**: Resolves a dynamic sequence of arrays/pages with <a href="https://github.com/vitaly-t/spex/wiki/Mixed-Values">mixed values</a>.  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>source</td><td><code>function</code></td><td></td><td><p>Expected to return the next page of data (array of <a href="https://github.com/vitaly-t/spex/wiki/Mixed-Values">mixed values</a>) to be resolved.
Returning nothing (<code>undefined</code>) or an empty array indicates the end of the sequence.</p>
<p>If the function returns anything other than an array or <code>undefined</code>, the method will
reject with object <code>{index, error}</code>:</p>
<ul>
<li><code>index</code> - index of the page for which the request failed</li>
<li><code>error</code> = <code>Unexpected data returned from the source.</code></li>
</ul>
<p>The function is called with the same <code>this</code> context as the calling method.</p>
<p>Parameters:</p>
<ul>
<li><code>index</code> - index of the page being requested</li>
<li><code>data</code> - previously returned page, resolved as a <a href="batch.md">batch</a>, <code>undefined</code> when <code>index=0</code></li>
</ul>
<p>If the function throws an error or returns a rejected promise, the sequence terminates,
and the method rejects with object <code>{index, error, source}</code>:</p>
<ul>
<li><code>index</code> - index of the request that failed</li>
<li><code>error</code> - the error thrown or the reject reason</li>
<li><code>source</code> - resolved <code>data</code> that was passed into the function</li>
</ul>
<p>Passing in anything other than a function will throw <code>Invalid page source.</code></p>
</td>
    </tr><tr>
    <td>[dest]</td><td><code>function</code></td><td></td><td></td>
    </tr><tr>
    <td>[limit]</td><td><code>Integer</code></td><td><code>0</code></td><td></td>
    </tr>  </tbody>
</table>

