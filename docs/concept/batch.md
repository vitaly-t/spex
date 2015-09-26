## Batch Processing
 
Consider executing a batch/array of promises within a temporary context:
  
* queries inside a database transaction
* logging a complete result into a file
* sending a whole package into a channel

Each time you are likely to open a receiving context, execute a batch of independent promises,
and then release the context. 

And while rejected promises may or may not be ignored, they often need to be finalized/settled
in order to avoid execution against a released context.

The standard method `promise.all` isn't suitable in this case, because it does not guarantee to
settle all the values in the array. And while some libraries offer a separate method to settle
an array of promises, it becomes difficult to combine the logic into one meaningful result. 

And this is where method [batch] comes into play:

* It settles all of the promises in the array
* It resolves in same way as `promise.all` when each value in the array resolves
* It rejects when any value in the array rejects, and with complete details
* It offers an extensive support for the results reporting and diagnostics

[batch]:code/batch.md
