<a name="read"></a>
## read(stream, receiver, [closable], [readSize]) ⇒ <code>Promise</code>
**Summary**: Reads the entire stream  

---
### Parameters
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>stream</td><td><code>Object</code></td><td></td><td><p>Readable stream</p>
</td>
    </tr><tr>
    <td>receiver</td><td><code>function</code></td><td></td><td><p>Function to receive the data for processing.</p>
<p>Parameters:
<code>index</code> = index of the call made to the receiver
<code>data</code> = array of data reads from the stream
<code>delay</code> = number of milliseconds since the last call (<code>undefined</code> when <code>index=0</code>)</p>
</td>
    </tr><tr>
    <td>[closable]</td><td><code>Boolean</code></td><td><code>false</code></td><td><p>Instructs the method to resolve on event <code>close</code> supported by the stream,
as opposed to the event <code>end</code> that&#39;s used by default.</p>
</td>
    </tr><tr>
    <td>[readSize]</td><td><code>Number</code></td><td><code></code></td><td><p>Sets the read size from the stream buffer when the data is available.
By default, the method reads all the data available in the buffer.</p>
</td>
    </tr>  </tbody>
</table>

**Returns**: <code>Promise</code> - When successful, resolves with object `{calls, reads, size, duration}`:`calls` = number of calls made into the receiver`reads` = number of successful reads from the stream`size` = total number of bytes read from the stream`duration` = number of milliseconds consumed by the method  
