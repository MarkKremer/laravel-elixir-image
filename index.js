var elixir = require('laravel-elixir'),
    gulp = require('gulp'),
    config = require('./config'),
    util = require('./lib/util'),
    logger = require('./lib/logger'),
    compiler = require('./lib/compiler').compiler;

/**
 * Create the compilation pipeline.
 *
 * @param options
 * @returns {through2}
 */
function compile(options) {
    var name = options.name;

    // Determine the base process base directory the paths should be relative from.
    var basedir = process.cwd();

    // Create and return the compilation pipeline.
    return (
        gulp
            .src(options.src.path)
            .pipe(logger(options))
            .pipe(options.compiler(options))
            .on('error', function(e) {
                new elixir.Notification().error(e, name + ' Compilation Failed');

                this.emit('end');
            })
            .pipe(gulp.dest(basedir))
            .pipe(new elixir.Notification(name + ' Compiled!'))
    );
}

// Add the 'img' command to Elixir to compile all images in the resources directory to the public directory.
elixir.extend('img', function (options, src, output) {

    // Set the defaults and other variables.
    options = options || {};
    options.convert = options.convert || config.convert.default;

    var exts = Object.keys(options.convert);

    src = src || '**/*.+(' + exts.join('|') + ')';
    output = output || config.destination.path;

    var paths = prepGulpPaths(src, output);

    // Add the gulp task to be executed by elixir.
    new elixir.Task('image', function () {
        return compile({
            name: 'Image',
            compiler: compiler,
            src: paths.src,
            output: paths.output,
            task: this,
            pluginOptions: options
        });
    })
        .watch(paths.src.path);
});

/**
 * Prep the Gulp src and output paths.
 *
 * @param  {string|array} src
 * @param  {string|null}  output
 * @return {object}
 */
var prepGulpPaths = function(src, output) {
    var gulpPaths = new elixir.GulpPaths()
        .src(src, config.source.path)
        .output(output || config.destination.path);
    return gulpPaths;
}