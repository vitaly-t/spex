"use strict";

var fs = require("fs");

var files = [
    {
        src: "lib/index.js",
        dest: "docs/module.md"
    },
    {
        src: "lib/ext/batch.js",
        dest: "docs/batch.md"
    },
    {
        src: "lib/ext/page.js",
        dest: "docs/page.md"
    },
    {
        src: "lib/ext/sequence.js",
        dest: "docs/sequence.md"
    }
];

// Automatic links:
var links = {
    "mixed value": "https://github.com/vitaly-t/spex/wiki/Mixed-Values",
    "mixed values": "https://github.com/vitaly-t/spex/wiki/Mixed-Values"
};

module.exports = function (grunt) {
    grunt.initConfig({
        jsdoc2md: {
            oneOutputFile: {
                options: {
                    "no-gfm": true
                },
                files: files
            }
        }
    });

    grunt.registerTask("fixLinks", fixLinks);
    grunt.loadNpmTasks("grunt-jsdoc-to-markdown");
    grunt.registerTask("default", ["jsdoc2md", "fixLinks"]);
};

//////////////////////////////////////////////////////////
// Replaces all `$[link name]` occurrences in file API.md
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
