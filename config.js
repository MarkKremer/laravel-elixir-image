var elixir = require('laravel-elixir'),
    path = require('path');

module.exports = {
    executables: {
        convert: path.join(__dirname, 'imagemagick/convert')
    },
    source: {
        path: path.join(elixir.config.assetsPath, 'img') // resources/assets/img
    },
    destination: {
        path: path.join(elixir.config.publicPath, 'img') // public/img
    },
    convertSameType: false,
    convert: {
        default: { 'psd': 'png' } // Convert psd to png files.
    }
};