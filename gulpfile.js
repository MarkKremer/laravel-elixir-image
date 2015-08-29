var elixir = require('laravel-elixir');

require('./index');

elixir(function(mix) {
    mix.img({
        'convert': {
            'psd': [ 'png', 'jpg', 'webp' ]
        }
    }, '**/*.psd', 'public/img');
});