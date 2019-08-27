// Automatic links:
const links = {
    'promise.all': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all',
    'Readable': 'https://nodejs.org/api/stream.html#stream_class_stream_readable',
    'stream': 'https://github.com/vitaly-t/spex/blob/master/docs/concept/stream.md',
    'client-side': 'https://github.com/vitaly-t/spex/blob/master/docs/client.md',
    'Promise': 'https://github.com/then/promise',
    'Bluebird': 'https://github.com/petkaantonov/bluebird',
    'When': 'https://github.com/cujojs/when',
    'Q': 'https://github.com/kriskowal/q',
    'RSVP': 'https://github.com/tildeio/rsvp.js',
    'Lie': 'https://github.com/calvinmetcalf/lie',
    'Promises/A+': 'https://promisesaplus.com'
};

function fixLinks(source) {
    return source.replace(/\$\[[a-z0-9\s/+-.]+\]/gi, name => {
        const sln = name.replace(/\$\[|]/g, ''); // stripped link name;
        if (sln in links) {
            return '<a href="' + links[sln] + '">' + sln + '</a>';
        }
        return name;
    });
}

module.exports = fixLinks;
