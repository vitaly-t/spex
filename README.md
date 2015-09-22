# Specialized Promise Extensions

[![Build Status](https://travis-ci.org/vitaly-t/spex.svg?branch=master)](https://travis-ci.org/vitaly-t/spex)
[![Coverage Status](https://coveralls.io/repos/vitaly-t/spex/badge.svg?branch=master)](https://coveralls.io/r/vitaly-t/spex?branch=master)

This project is a work-in-progress, but you already can try it:
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

Methods implemented: [batch], [page] and [sequence]. 

### Stage 1: Formulating the protocol

This one is DONE! :)

### Stage 2: Implementation

This one is DONE! :)

### Stage 3: Tests + Documentation 

Currently working on tests + [API documentation](API.md)

[batch]:API.md#batch
[page]:API.md#page
[sequence]:API.md#sequence
