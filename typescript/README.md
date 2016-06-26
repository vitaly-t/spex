### TypeScript for SPEX

Complete TypeScript ambient declarations for [spex] version 1.0.7 or later.

#### Inclusion

Since all TypeScript files are distributed with the library, you can reference it like this: 

```ts
/// <reference path='../node_modules/spex/typescript/spex' />
```

Or you can install it using [Typings]:

```
$ typings install --save --global github:vitaly-t/spex
```

Then you can use the generic reference:

```ts
/// <reference path='../typings/index' />
```


#### Usage

```ts
/// <reference path="../typings/index" />

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

[Typings]:https://github.com/typings/typings
[spex]:https://github.com/vitaly-t/spex
