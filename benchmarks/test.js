// All the promise libraries to run the tests against;
var libraries = [
    {
        name: "Native",
        lib: Promise
    },
    {
        name: "Bluebird",
        lib: require("bluebird")
    },
    {
        name: "Promise",
        lib: require("Promise")
    },
    {
        name: "When",
        lib: require("when")
    },
    {
        name: "Q",
        lib: require("q")
    },
    {
        name: "RSVP",
        lib: require("rsvp")
    },
    {
        name: "Lie",
        lib: require("lie")
    }
];

var spex = require("../lib/index");

function run(test, name) {
    if (typeof test !== 'function') {
        throw new TypeError("Test callback function is required.");
    }
    console.log("*******************************");
    console.log("** TEST-START:", name);

    function loop(idx) {
        var l = libraries[idx];
        test(spex(l.lib), l, function () {
            idx++;
            if (idx === libraries.length) {
                console.log("** TEST-END:", name);
                console.log("*******************************");
            } else {
                loop(idx);
            }
        });
    }

    loop(0);
}

function numberFormat(num) {
    if (typeof num !== 'string') {
        num = num.toString();
    }
    return num.replace(/\B(?=(\d{3})+\b)/g, ",")
}

module.exports = {
    run: run,
    format: numberFormat
};
