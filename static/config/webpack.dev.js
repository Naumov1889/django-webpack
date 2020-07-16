const paths = require('./paths')
const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
    /**
     * Mode
     *
     * Set the mode to development or production.
     */
    mode: 'development',

    /**
     * Devtool
     *
     * Control how source maps are generated.
     */
    devtool: 'inline-source-map',

    /**
     * DevServer
     *
     * Spin up a server for quick development.
     */
    devServer: {
        historyApiFallback: true,
        contentBase: paths.build,
        writeToDisk: true,  // no sure
        open: true,
        compress: true,
        hot: true,
        port: 8080,
    },

    module: {
        rules: [
            /**
             * Styles
             *
             * Inject CSS into the head with source maps.
             */
            {
                test: /\.(pcss|css)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            from: paths.src + "/" + "styles",  // necessary for postcss-import
                            plugins: [
                                require("postcss-import"),
                                require('precss'),
                                require("css-mqpacker"),
                            ]
                        }
                    }
                ]
            },
        ]
    },

    plugins: [
        /**
         * HotModuleReplacementPlugin
         *
         * Only update what has changed.
         */
        new webpack.HotModuleReplacementPlugin(),
    ],
})

