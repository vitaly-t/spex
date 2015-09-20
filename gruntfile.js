"use strict";

var fs = require("fs");

module.exports = function (grunt) {
    grunt.initConfig({
        jsdoc2md: {
            oneOutputFile: {
                options: {
                    "no-gfm": true
                },
                src: "lib/**/*.js",
                dest: "API.md"
            }
        }
    });

    grunt.registerTask("appendLinks", function () {
        var done = this.async();
        fs.readFile("static/links.md", "utf-8", function (err, data) {
            fs.appendFile("API.md", data, done);
        });
    });

    grunt.loadNpmTasks("grunt-jsdoc-to-markdown");
    grunt.registerTask("default", ["jsdoc2md", "appendLinks"]);
};
