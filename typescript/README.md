### TypeScript for SPEX

Complete TypeScript module declarations for [spex] version 1.0.7 or later.

#### Inclusion

Typescript should be able to pick up type definition for [spex] without any manual configuration.

#### Usage

```ts
import * as spexLib from "spex";

var spex:spexLib.ISpex = spexLib(Promise);

type BatchError = typeof spex.errors.BatchError;

spex.batch([1, 2, 3])
    .then(data=> {
        var r = data[0].anything;
    })
    .catch(error=> {
        // error type is either TypeError or BatchError
    });
```

[spex]:https://github.com/vitaly-t/spex
