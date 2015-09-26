# Specialized Promise Extensions

[![Build Status](https://travis-ci.org/vitaly-t/spex.svg?branch=master)](https://travis-ci.org/vitaly-t/spex)
[![Coverage Status](https://coveralls.io/repos/vitaly-t/spex/badge.svg?branch=master)](https://coveralls.io/r/vitaly-t/spex?branch=master)

[batch], [page], [sequence] - commonly missing promise methods for dealing with:
* [throttling and load balancing](docs/concept/throttling.md)
* [linked and detached sequencing](docs/concept/sequencing.md)
* [streaming and paging](docs/concept/streaming.md)
* [batch processing](docs/concept/batch.md)

### Installing
```
$ npm install spex
```

### Testing
```
$ npm test
```

### Usage
* For any [Promises/A+] library - [Promise], [Bluebird], [When], [Q], [RSVP], etc.
```javascript
var promise = require('bluebird');
var spex = require('spex')(promise);
```
* For ES6 promises:
```javascript
var spex = require('spex')(Promise);
```
See the [API].

[API]:docs/index.md
[batch]:docs/code/batch.md
[page]:docs/code/page.md
[sequence]:docs/code/sequence.md
[Promises/A+]:https://promisesaplus.com/
[Promise]:https://github.com/then/promise
[Bluebird]:https://github.com/petkaantonov/bluebird
[When]:https://github.com/cujojs/when
[Q]:https://github.com/kriskowal/q
[RSVP]:https://github.com/tildeio/rsvp.js
