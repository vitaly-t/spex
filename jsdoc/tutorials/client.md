---

This library is compatible with [Browserify], and can be easily used in a web application.

You can either browserify the library yourself, or use predefined commands from within the module's root folder:

* install the library's DEV dependencies:

```
$ npm install
```

* create client-side version of the library:
 
```
$ npm run browserify
```

This generates file `spex.js` within the module's root folder, to be copied into your web project.

The library exposes global variable `spexLib`, to be initialized as shown in the following example:

```html
<script src="spex.js"></script>
<script>
    const spex = spexLib(Promise); // Initializing with ES6 Promise;
</script>
```

[Browserify]:https://github.com/substack/node-browserify
