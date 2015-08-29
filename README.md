# laravel-elixir-image
A Laravel Elixir image conversion extension using ImageMagick. This extension makes it possible to automatically convert your images into various formats such as PNG, JPG and WebP.

## Quick use
To convert all PSD files in the `resources/assets/img` directory to PNG, JPG and WebP files in the `public/img`, use the following code:
```
var elixir = require('laravel-elixir');

require('laravel-elixir-image');

elixir(function(mix) {
    mix.img({
        'convert': {
            'psd': [ 'png', 'jpg', 'webp' ]
        }
    }, '**/*.psd', 'public/img');
});
```

All arguments are optional. If left away, the second argument is generated using the convert option and will match all files for which a convertion is defined.

## Frequently asked questions
#### Supported formats
The extension should support every file format Image Magick supports. I have tested it with a PSD (Photoshop) file as image source and PSD, PNG, JPG and WebP files as output.

## Licence
Laravel-elixir-image is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT). However, it uses an ImageMagick executable which comes with it's own license:
> Copyright 2015 Mark Kremer
> 
>   Licensed under the ImageMagick License (the "License"); you may not use
>   this file except in compliance with the License.  You may obtain a copy
>   of the License at
>
>     http://www.imagemagick.org/script/license.php
>
>   Unless required by applicable law or agreed to in writing, software
>   distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
>   WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
>   License for the specific language governing permissions and limitations
>   under the License.

All files in the in the imagemagick directory are subjected to this license.
