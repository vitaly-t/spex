"use strict";

var fs = require("fs");
var mdFile = "API.md";

module.exports = function (grunt) {
    grunt.initConfig({
        jsdoc2md: {
            oneOutputFile: {
                options: {
                    "no-gfm": true
                },
                src: "lib/**/*.js",
                dest: mdFile
            }
        }
    });

    grunt.registerTask("fixLinks", fixLinks);
    grunt.loadNpmTasks("grunt-jsdoc-to-markdown");
    grunt.registerTask("default", ["jsdoc2md", "fixLinks"]);
};

// Automatic links:
var links = {
    "mixed value": "https://github.com/vitaly-t/spex/wiki/Mixed-Values",
    "mixed values": "https://github.com/vitaly-t/spex/wiki/Mixed-Values"
};

//////////////////////////////////////////////////////////
// Replaces all `$[link name]` occurrences in file API.md
// with the corresponding link tag as defined on the list.
function fixLinks() {
    var done = this.async();
    fs.readFile(mdFile, "utf-8", function (_, data) {
        data = data.replace(/\$\[[a-z0-9\s]+\]/gi, function (name) {
            var sln = name.replace(/\$\[|\]/g, ''); // stripped link name;
            if (sln in links) {
                return "<a href=\"" + links[sln] + "\">" + sln + "</a>"
            }
            return name;
        });
        fs.writeFile(mdFile, data, done);
    });
}
