## Client-Side SPEX Usage

Starting with version 3.0.0, this library became compatible with [Browserify],
so it can be easily used in a web application.

You can either browserify the library yourself, or use predefined commands
from within the module's root folder:

1. install all the library's dependencies:
```
$ npm install
```
2. create the client-side version of the library: 
```
$ npm run browserify
```
This generates file `spex.js` within the module's root folder.

The library's instance is exposed via global variable `spexLib`, which can be used to
initialize the library with your promise library of choice, as shown in the example below:
 
```html
<script src="spex.js"></script>
<script>
    var spex = spexLib(Promise);
</script>
```

[Browserify]:https://github.com/substack/node-browserify
