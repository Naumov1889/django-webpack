const fs = require('fs')
const path = require('path')
const paths = require('./paths')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackPugPlugin = require('html-webpack-pug-plugin');
var BundleTracker = require('webpack-bundle-tracker');

// dynamically add all pug files to the config
let templates = [];
let files = fs.readdirSync(paths.src);
files.forEach(file => {
    if (file.match(/\.pug$/)) {
        let filename = file.substring(0, file.length - 4);
        templates.push(
            new HtmlWebpackPlugin({
                template: paths.src + '/' + filename + '.pug',
                filename: filename + '.html',
            })
        );
    }
});

module.exports = {
    /**
     * Entry
     *
     * The first place Webpack looks to start building the bundle.
     */
    entry: [paths.src + '/index.js'],

    /**
     * Output
     *
     * Where Webpack outputs the assets and bundles.
     */
    output: {
        path: paths.build,
        filename: '[name].bundle.js',
        publicPath: './',
    },

    /**
     * Plugins
     *
     * Customize the Webpack build process.
     */
    plugins: [
        /**
         * CleanWebpackPlugin
         *
         * Removes/cleans build folders and unused assets when rebuilding.
         */
        new CleanWebpackPlugin(),

        /**
         * CopyWebpackPlugin
         *
         * Copies files from target to destination folder.
         */
        new CopyWebpackPlugin([
            {
                from: paths.static,
                to: 'assets',
                ignore: ['*.DS_Store'],
            },
        ]),

        /**
         * HtmlWebpackPlugin
         *
         * Generates an HTML file from a template.
         */
        ...templates,
        new HtmlWebpackPugPlugin(),

        new BundleTracker({
            publicPath: 'static/dist/',
            filename: 'webpack-stats.json'
        }),
    ],

    /**
     * Module
     *
     * Determine how modules within the project are treated.
     */
    module: {
        rules: [
            /**
             * JavaScript
             *
             * Use Babel to transpile JavaScript files.
             */
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader', 'eslint-loader'],
            },

            /**
             * Images
             *
             * Copy image files to build folder.
             */
            {
                test: /\.(?:ico|gif|png|jpg|jpeg|webp|svg)$/i,
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]',
                    context: 'src', // prevent display of src/ in filename
                },
            },

            /**
             * Fonts
             *
             * Inline font files.
             */
            {
                test: /\.(woff(2)?|eot|ttf|otf|)$/,
                loader: 'url-loader',
                options: {
                    limit: 8192,
                    name: '[path][name].[ext]',
                    context: 'src', // prevent display of src/ in filename
                },
            },
            {
                test: /\.pug/,
                use: [
                    {
                        loader: "html-loader",
                    },
                    {
                        loader: "pug-html-loader",
                        options: {
                            // other options https://pugjs.org/api/reference.html
                            pretty: true  // to not minify
                        }
                    }
                ],
            }
        ],
    },
}
