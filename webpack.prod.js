const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const Dotenv = require('dotenv-webpack');
module.exports = merge(common, {
    mode: 'production',
    output: {
        publicPath: '/'
    },
    plugins: [
        new Dotenv(),
        new webpack.DefinePlugin({
            BACKEND_URL: JSON.stringify(process.env.BACKEND_URL)
        })
    ]
});
