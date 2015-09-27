## Data Throttling & Load Balancing

Data throttling is about processing data in chunks, an intentional bottleneck added for predictable rate of processing and thus resources consumption. 

Load balancing is about enforcing a time quota on operations that need to execute in parallel with other tasks in the system. As such, its implementation
is usually limited to a single system, as opposed to data throttling that can be used by multiple systems independently.


This document is a work-in-progress.
