var elixir = require('laravel-elixir'),
    path = require('path');

module.exports = {
    executables: {
        convert: path.join(__dirname, 'imagemagick/convert')
    },
    source: {
                     /* Elixir 3.0.0                Elixir 2.0.0 */
        path: path.join(elixir.config.assetsPath || elixir.config.assetsDir, 'img') // resources/assets/img
    },
    destination: {
                     /* Elixir 3.0.0                Elixir 2.0.0 */
        path: path.join(elixir.config.publicPath || elixir.config.publicDir, 'img') // public/img
    },
    convertSameType: false,
    convert: {
        default: { 'psd': 'png' } // Convert psd to png files.
    }
};