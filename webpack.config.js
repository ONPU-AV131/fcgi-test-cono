var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'htdocs');
var APP_DIR = path.resolve(__dirname, 'js');

var config = {
    entry: APP_DIR + '/index.jsx',
    output: {
        path: BUILD_DIR,
        filename: 'bundle.js'
    },
    module : {
        loaders : [
            {
                test : /\.jsx?/,
                include : APP_DIR,
                loader : 'babel'
            }
        ]
    },
    plugins: [   
        new webpack.optimize.UglifyJsPlugin({minimize: true}),
        new webpack.DefinePlugin({  "process.env": {      NODE_ENV: JSON.stringify("production")    }})
    ]
};

module.exports = config;
