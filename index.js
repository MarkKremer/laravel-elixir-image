var elixir = require('laravel-elixir'),
    gulp = require('gulp'),
    path = require('path'),
    config = require('./config'),
    util = require('./lib/util'),
    logger = require('./lib/logger'),
    compiler = require('./lib/compiler').compiler;

// Backward compatibility for Elixir notifications.
var notification;
if(elixir.Notification) {
    // Elixir 3.0.0
    notification = function (message) {
        return new elixir.Notification(message);
    }
} else {
    // Elixir 2.0.0
    var Notification = require(path.join(
        path.dirname(require.resolve('laravel-elixir')),
        'ingredients/commands/Notification'
    ));
    notification = function (message) {
        return new Notification().message(message);
    }
}

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
            .pipe(notification(name + ' Compiled!'))
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
    function returnCompileTask() {
        return compile({
            name: 'Image',
            compiler: compiler,
            src: paths.src,
            output: paths.output,
            task: this,
            pluginOptions: options
        });
    }

    if(elixir.Task) {
        // Elixir 3.0.0
        new elixir.Task('image', returnCompileTask)
            .watch(paths.src.path);
    } else {
        // Elixir 2.0.0
        gulp.task('image', returnCompileTask);
        this.registerWatcher('image', paths.src.path);
        return this.queueTask('image');
    }
});

/**
 * Prep the Gulp src and output paths.
 *
 * @param  {string|array} src
 * @param  {string|null}  output
 * @return {object}
 */
var prepGulpPaths = function(src, output) {
    if(elixir.GulpPaths) {
        // Elixir 3.0.0
        var gulpPaths = new elixir.GulpPaths()
            .src(src, config.source.path)
            .output(output || config.destination.path);
        return gulpPaths;
    } else {
        // Elixir 2.0.0
        var sourcePath = path.join(config.source.path, src),
            destPath = output || config.destination.path;

        return {
            src: {
                path: sourcePath,
                baseDir: path.dirname(sourcePath)
            },
            output: {
                path: destPath,
                baseDir: destPath
            }
        };
    }
}