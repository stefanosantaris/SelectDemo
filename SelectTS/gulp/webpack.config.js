var webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');
var path = require('path')

module.exports = {
    config: function () {
        return {
            output: {
                path: path.join(__dirname,'../dist'),
                filename: 'proxy.js',
            },
            entry: path.join(__dirname, '../ts/client/SelectClient.ts'),
            devtool: 'source-map',
            plugins: [
                new webpack.optimize.OccurrenceOrderPlugin()
            ],
            resolve: {
                extensions: ['', '.ts', '.js']
            },
            module: {
                loaders: [
                    {test: /Constants.ts$/, loader: path.join(__dirname, 'version-git-rev')},
                    {test: /\.ts$/, loader: 'ts'},
                    {test: /\.json$/, loader: "json-loader"}
                ]
            },
            target: 'node', // in order to ignore built-in modules like path, fs, etc.
            node: {
                __dirname: false,
                __filename: false,
            },
            externals: [
                // proxy modules
                nodeExternals({modulesDir: path.join(__dirname, "../node_modules")})
            ] // in order to ignore all modules in node_modules folder
            //externals: [/^[a-z\-0-9]+$/]
        }
    }
}
