## Data Throttling & Load Balancing

#### Terminology

*Data throttling* is processing data in limited chunks, as an intentional bottleneck added for predictable rate of processing.
It adds quantifiable throughput to control either resource consumption or a traffic quota.  
 
*Load balancing* is about enforcing a time quota on operations that need to take turns with other tasks in the system.
As such, its implementation is usually limited to a single system, while *data throttling* can be employed by multiple systems independently.

#### Solution

With the help of method [page], promises can be resolved in chunks, thus throttling the data processing, while method [sequence] can do the same
on the one-by-one basis. 
 
Both methods support return of promises from `source` or `destination` handlers, which allows injecting any necessary
delays needed to implement *load balancing*.

[page]:https://github.com/vitaly-t/spex/blob/master/docs/code/page.md
[sequence]:https://github.com/vitaly-t/spex/blob/master/docs/code/sequence.md
