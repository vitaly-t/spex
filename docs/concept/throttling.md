## Data Throttling & Load Balancing

#### Terminology

*Data throttling* is processing data in limited chunks, as an intentional bottleneck added for predictable rate of processing.
It adds quantifiable throughput to control either resource consumption or a traffic quota.  
 
*Load balancing* is about enforcing a time quota on operations that need to take turns with other tasks in the system.
As such, its implementation is usually limited to a single system, while *data throttling* can be employed by multiple systems independently.

