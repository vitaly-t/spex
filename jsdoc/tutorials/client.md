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

This generates file `spex.js` within the module's root folder, to be copied into your web project,
which exposes global variable `spexLib`:

```html
<script src="spex.js"></script>
<script>
    const {batch, page, sequence, errors} = spexLib;
</script>
```

[Browserify]:https://github.com/substack/node-browserify
