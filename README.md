# Specialized Promise Extensions

[![Build Status](https://travis-ci.org/vitaly-t/spex.svg?branch=master)](https://travis-ci.org/vitaly-t/spex)
[![Coverage Status](https://coveralls.io/repos/vitaly-t/spex/badge.svg?branch=master)](https://coveralls.io/r/vitaly-t/spex?branch=master)

[batch], [page], [sequence] - promise methods for the following patterns:
* [Data Throttling & Load Balancing](docs/concept/throttling.md)
* [Linked and Detached Sequencing](docs/concept/sequencing.md)
* [Streaming and Paging](docs/concept/streaming.md)
* [Batch Processing](docs/concept/batch.md)

### Installing

```
$ npm install spex
```

### Testing

```
$ npm test
```

### Usage

* For any [Promises/A+] library: [Promise], [Bluebird], [When], [Q], [RSVP], etc.
```javascript
var promise = require('bluebird');
var spex = require('spex')(promise);
```
* For ES6 Promise:
```javascript
var spex = require('spex')(Promise);
```

### API

* [Module]
* Methods
 - [batch]
 - [page]
 - [sequence]

[Module]:https://github.com/vitaly-t/spex/blob/master/docs/code/module.md
[batch]:https://github.com/vitaly-t/spex/blob/master/docs/code/batch.md
[page]:https://github.com/vitaly-t/spex/blob/master/docs/code/page.md
[sequence]:https://github.com/vitaly-t/spex/blob/master/docs/code/sequence.md
[Promises/A+]:https://promisesaplus.com/
[Promise]:https://github.com/then/promise
[Bluebird]:https://github.com/petkaantonov/bluebird
[When]:https://github.com/cujojs/when
[Q]:https://github.com/kriskowal/q
[RSVP]:https://github.com/tildeio/rsvp.js
