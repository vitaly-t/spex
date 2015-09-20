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

    grunt.registerTask("fixLinks", function () {
        var done = this.async();
        fs.readFile(mdFile, "utf-8", function (err, data) {
            data = data.replace(/\$\[[a-z0-9\s]+\]/gi, function (name) {
                var svn = name.replace(/\$\[|\]/g, ''); // stripped variable name;
                if (svn in links) {
                    //return "{@link " + links[svn] + "|" + svn + "}";
                    return "<a href='" + links[svn] + "'>" + svn + "</a>"
                } else {
                    return name;
                }
            });
            fs.writeFile(mdFile, data, done);
        });
    });

    grunt.loadNpmTasks("grunt-jsdoc-to-markdown");
    grunt.registerTask("default", ["jsdoc2md", "fixLinks"]);
};

var links = {
    "mixed value": "https://github.com/vitaly-t/spex/wiki/Mixed-Values",
    "mixed values": "https://github.com/vitaly-t/spex/wiki/Mixed-Values"
};
