*Warning: I just created this extension and I still have to get the little bugs out.*

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
#### What image formats does it support?
The extension should support every file format Image Magick supports. I have tested it with a PSD (Photoshop) file as image source and PSD, PNG, JPG and WebP files as output.
#### Does it run on other platforms than Windows?
Currently not, however it does only need the ImageMagick convert binary for your platform so it shouldn't be that difficult to do it yourself. The location of the binary can be changed in config.js.
#### Which Elixer versions does it support?
I'm trying to make the extension both compatible with Elixir ^2.0.0 and ^3.0.0. At the time of writing a fresh composer install of Laravel ships with Elixir 2 although Elixir 3 comes with some nice changes so I don't want to exclude either one of them.

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
