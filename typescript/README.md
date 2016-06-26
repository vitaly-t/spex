### TypeScript for SPEX

Complete TypeScript ambient declarations for [spex] version 1.0.7 or later.

#### Installing

```
 typings install --save --global  github:vitaly-t/spex
```

#### Usage

```ts
/// <reference path="../typings/index" />

import * as spexLib from "spex";

var spex = spexLib(Promise);

spex.batch([1, 2, 3])
    .then(data=> {
        var r = data[0].anything;
    })
    .catch(error=> {
        var e = <typeof spex.errors.BatchError>error;
        var duration = e.stat.duration;
    });
```

[spex]:https://github.com/vitaly-t/spex

