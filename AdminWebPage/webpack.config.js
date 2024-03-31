const path = require('path');

module.exports = {
  mode: 'development',
  entry: './Server/AddStore.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
