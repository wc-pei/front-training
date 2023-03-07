const path = require('path');
const webpack = require('webpack');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackWatchedGlobEntries = require('webpack-watched-glob-entries-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const entries = WebpackWatchedGlobEntries.getEntries([path.resolve(__dirname, './src/ts/**/*.ts')], {
    ignore: path.resolve(__dirname, './src/ts/**/_*.ts'),
})();

const htmlGlobPlugins = (entries, srcPath) => {
    return Object.keys(entries).flatMap(
        (key) => [
            new HtmlWebpackPlugin({
                inject: 'body',
                filename: `${key}.html`,
                template: `${srcPath}/${key}.html`,
                chunks: [key],
            })
        ]
    );
};

module.exports = (outputFile) => ({
    entry: entries,

    output: {
        path: path.resolve(__dirname, './dist'),
        filename: `./js/${outputFile}.js`,
    },

    devServer: {
        port: 3000,
        open: true,
        // ディレクトリの指定でhtmlファイルでも監視できる
        watchFiles: ['src/*', 'src/**/*']
    },

    module: {
        rules: [
            {
                // 拡張子 .ts の場合
                test: /\.ts$/,
                // TypeScript をコンパイルする
                use: 'ts-loader',
            },
            {
                test: /\.(sa|sc|c)ss$/i,
                use: [
                    // cssファイルとして別ファイルに出力する
                    MiniCssExtractPlugin.loader,

                    // cssをCommonJS形式に変換してjavaScriptで扱えるようにする
                    'css-loader',
                    {
                        // PostCSSでcssを処理する
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                // ベンダープレフィックスを自動付与する
                                plugins: [require('autoprefixer')({grid: true})],
                            },
                        },
                    },
                    {
                        // sassをコンパイルしてcssに変換する
                        loader: 'sass-loader',
                        options: {
                            // Dart Sassを使えるようにする
                            implementation: require('sass'),
                        },
                    },
                ],
            },

            {
                test: /\.html$/i,
                loader: 'html-loader',
            },

            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                generator: {
                    filename: `./image/[name].[contenthash][ext]`,
                },
                type: 'asset/resource',
            },
        ],
    },

    // import 文で .ts ファイルを解決するため
    // これを定義しないと import 文で拡張子を書く必要が生まれる。
    // フロントエンドの開発では拡張子を省略することが多いので、
    // 記載したほうがトラブルに巻き込まれにくい。
    resolve: {
        // 拡張子を配列で指定
        extensions: [
            '.ts', '.js',
        ],
    },

    plugins: [
        new CleanWebpackPlugin(),
        new WebpackWatchedGlobEntries(),

        new MiniCssExtractPlugin({
            filename: `./css/${outputFile}.css`,
        }),

        new webpack.ProvidePlugin({
           $: "jquery",
           jQuery: "jquery"
        }),

        ...htmlGlobPlugins(entries, './src'),
    ],
});