<a name="read"></a>
## read(stream, receiver, [closable], [readSize]) ⇒ <code>Promise</code>
**Summary**: Consumes and processes data from a <a href="https://nodejs.org/api/stream.html#stream_class_stream_readable">Readable</a> stream.  

---
Reads the entire stream, using **paused mode**, with support for both synchronousand asynchronous data processing.**NOTE:** Once the method has finished, the onus is on the caller to release the streamaccording to its protocol.

### Parameters
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>stream</td><td><code>Object</code></td><td></td><td><p><a href="https://nodejs.org/api/stream.html#stream_class_stream_readable">Readable</a> stream object.</p>
<p>Passing in anything else will throw <code>Readable stream is required.</code></p>
</td>
    </tr><tr>
    <td>receiver</td><td><code>function</code></td><td></td><td><p>Callback to process the data.</p>
<p>Passing in anything else will throw <code>Invalid stream receiver.</code></p>
<p>Parameters:</p>
<ul>
<li><code>index</code> = index of the call made to the function</li>
<li><code>data</code> = array of all data reads from the stream&#39;s buffer</li>
<li><code>delay</code> = number of milliseconds since the last call (<code>undefined</code> when <code>index=0</code>)</li>
</ul>
<p>The function is called with the same <code>this</code> context as the calling method.</p>
<p>It can optionally return a promise object, if data processing is asynchronous.
And if a promise is returned, the method will not read any more data from the
stream until the promise has been resolved. Returning a rejected promise will
stop processing and the method will reject with the reason specified.</p>
</td>
    </tr><tr>
    <td>[closable]</td><td><code>Boolean</code></td><td><code>false</code></td><td><p>Instructs the method to resolve on event <code>close</code> supported by the stream,
as opposed to event <code>end</code> that&#39;s used by default.</p>
</td>
    </tr><tr>
    <td>[readSize]</td><td><code>Number</code></td><td></td><td><p>Sets the read size from the stream buffer when the next data is available.
By default, the method reads all the data currently available in the buffer.</p>
</td>
    </tr>  </tbody>
</table>

**Returns**: <code>Promise</code> - When successful, resolves with object `{calls, reads, size, duration}`: - `calls` = number of calls made into the `receiver` - `reads` = number of successful reads from the stream - `size` = total number of bytes read from the stream - `duration` = number of milliseconds consumed by the methodWhen fails, the method rejects with the error/reject specified,which can happen as a result of: - event `error` emitted by the stream - receiver throws an error or returns a rejected promise  
