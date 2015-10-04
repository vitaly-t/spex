## Streaming and Paging

In the most generic terms, data streaming is copying data from a source/provider into a destination/recipient. 

In the world of promises this can be formulated as acquiring promises from a source, resolving them and passing
the result into a destination for processing.

And this is exactly what methods [page] and [sequence] can do. They can handle both limited and infinite streams,
and they can stream data either one-by-one (method [sequence]) or in packages (method [sequence]).

[page]:https://github.com/vitaly-t/spex/blob/master/docs/code/page.md
[sequence]:https://github.com/vitaly-t/spex/blob/master/docs/code/sequence.md
