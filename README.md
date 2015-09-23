# Specialized Promise Extensions

[![Build Status](https://travis-ci.org/vitaly-t/spex.svg?branch=master)](https://travis-ci.org/vitaly-t/spex)
[![Coverage Status](https://coveralls.io/repos/vitaly-t/spex/badge.svg?branch=master)](https://coveralls.io/r/vitaly-t/spex?branch=master)

[batch], [sequence], [page] - commonly missing promise methods for dealing with:
* throttling and load balancing
* linked and detached sequencing
* streaming and paging
* batch processing

### Usage

```
$ npm install spex
```
For third-party promise libraries:
```javascript
var promise = require('bluebird');
var spex = require('spex')(promise);
```
For ES6 promises:
```javascript
var spex = require('spex')(Promise);
```

[batch]:docs/batch.md
[page]:docs/page.md
[sequence]:docs/sequence.md
