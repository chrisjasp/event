var path = require('path');

var config = {
        entry: './src/index.js',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'ctjs-event.js',
            libraryTarget: 'umd',
            library: 'ctjs-event'
        },
        module: {
            rules: [
                {test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"}
            ]
        }
    };

module.exports = config;