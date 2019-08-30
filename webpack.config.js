const path = require('path'),
    webpack = require('webpack'),
    BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin,
    { CleanWebpackPlugin } = require('clean-webpack-plugin'),
    ManifestPlugin = require('webpack-manifest-plugin')
;

module.exports = (env, argv) => {

    const
        analyze = false,
        isProduction = argv.mode === 'production',
        useSourcemaps = !isProduction,
        babelConfig = {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader",
                options: {
                    cacheDirectory: true,
                    sourceMap: useSourcemaps,
                    presets: [
                        ["@babel/preset-env", {
                            useBuiltIns: "entry",
                            corejs: 3,
                            targets: {
                                browsers: [
                                    "> 0.3%"
                                ]
                            },
                        }],
                        "@babel/preset-react",
                    ],
                    plugins: [
                        ["@babel/plugin-transform-runtime", {
                            corejs: 3,
                        }],
                        "@babel/plugin-syntax-dynamic-import",
                    ]
                }
            }
        },
        plugins = [
            new CleanWebpackPlugin({
                cleanOnceBeforeBuildPatterns: ['**/*', '!.gitkeep'],
            }),
            new ManifestPlugin(),
            new webpack.HashedModuleIdsPlugin(),
        ]
    ;

    if (isProduction) {
        babelConfig.use.options.plugins.push("transform-react-remove-prop-types");
    }
    if (analyze) {
        plugins.push(new BundleAnalyzerPlugin({
            generateStatsFile: true,
            openAnalyzer: false,
        }));
    }

    return {
        mode: isProduction ? 'production' : 'development',
        context: path.resolve(__dirname),
        entry: {
            vacancyFeed: [
                './assets/js/vacancy.js',
            ],
        },
        output: {
            path: path.resolve(__dirname, './dist'),
            filename: '[name].[contenthash].js',
        },
        module: {
            rules: [
                babelConfig,
            ],
        },
        plugins: plugins,
        devtool: useSourcemaps ? 'inline-source-map' : false,
        devServer: {
            host: 'localhost',
            port: 8080,
            contentBase: ('/public/'),
            publicPath: 'localhost:8080/build/',
            watchContentBase: false,
            compress: false,
            open: false,
            disableHostCheck: true,
            hot: true,
            progress: true,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
            }
        }
    }
};
