module.exports = {
    mode: 'development',
    entry: './src/main.js',
    resolveLoader: {
        modules: ['node_modules'],
        extensions: ['.js', '.json'],
        mainFields: ['loader', 'main']
    },
    module: {
        rules: [{ test: /\.txt$/, use: 'raw-loader' }]
    }
};
