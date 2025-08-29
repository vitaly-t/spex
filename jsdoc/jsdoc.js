module.exports = {
    source: {
        include: [
            'src'
        ]
    },
    opts: {
        recurse: true,
        destination: '../spex-api'
    },
    templates: {
        default: {
            layoutFile: 'jsdoc/layout.html',
            staticFiles: {
                include: [
                    './jsdoc/style.css'
                ]
            }
        }
    },
    plugins: [
        'plugins/markdown',
        './jsdoc/shortLinks'
    ]
};
