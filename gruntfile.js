"use strict";

module.exports = function (grunt) {
    grunt.initConfig({
        jsdoc2md: {
            output: {
                options: {
                    "no-gfm": true,
                    "partial": "docs/body.hbs"
                },
                files: files
            }
        }
    });

    grunt.registerTask("fixLinks", fixLinks);
    grunt.loadNpmTasks("grunt-jsdoc-to-markdown");
    grunt.registerTask("default", ["jsdoc2md", "fixLinks"]);
};

var codePath = "docs/code/"; // folder for all generated code documentation;

var files = [
    {
        src: "lib/index.js",
        dest: codePath + "module.md"
    },
    {
        src: "lib/ext/batch.js",
        dest: codePath + "batch.md"
    },
    {
        src: "lib/ext/page.js",
        dest: codePath + "page.md"
    },
    {
        src: "lib/ext/sequence.js",
        dest: codePath + "sequence.md"
    },
    {
        src: "lib/ext/stream/read.js",
        dest: codePath + "stream/read.md"
    }
];

// Automatic links:
var links = {
    "mixed value": "https://github.com/vitaly-t/spex/wiki/Mixed-Values",
    "mixed values": "https://github.com/vitaly-t/spex/wiki/Mixed-Values",
    "Readable": "https://nodejs.org/api/stream.html#stream_class_stream_readable",
    "batch": "batch.md",
    "page": "page.md",
    "sequence": "sequence.md",
    "Promise": "https://github.com/then/promise",
    "Bluebird": "https://github.com/petkaantonov/bluebird",
    "When": "https://github.com/cujojs/when",
    "Q": "https://github.com/kriskowal/q",
    "RSVP": "https://github.com/tildeio/rsvp.js",
    "Lie": "https://github.com/calvinmetcalf/lie"
};

var fs = require("fs");

//////////////////////////////////////////////////////////
// Replaces all `$[link name]` occurrences in each MD file
// with the corresponding link tag as defined on the list.
function fixLinks() {
    var done = this.async(), count = 0;
    files.forEach(function (f) {
        fs.readFile(f.dest, "utf-8", function (_, data) {
            data = data.replace(/\$\[[a-z0-9\s]+\]/gi, function (name) {
                var sln = name.replace(/\$\[|\]/g, ''); // stripped link name;
                if (sln in links) {
                    return "<a href=\"" + links[sln] + "\">" + sln + "</a>"
                }
                return name;
            });
            fs.writeFile(f.dest, data, check);
        });
    });
    function check() {
        if (++count === files.length) {
            done();
        }
    }
}
