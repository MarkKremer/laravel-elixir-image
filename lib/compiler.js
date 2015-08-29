var gutil = require('gulp-util'),
    through = require('through2'),
    path = require('path'),
    spawn = require('child_process').spawn,
    config = require('./../config'),
    util = require('./util');

/**
 * Check if the file should be skipped because it is empty or because of incompatibility.
 *
 * @param file
 * @param cb
 * @returns {*}
 */
function skipCheck(file, cb) {

    if (file.isNull()) {
        return cb(null, file);
    }
    if (file.isStream()) {
        return cb(new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
    }
    if (path.basename(file.path).indexOf('_') === 0) {
        return cb();
    }
    if (!file.contents.length) {
        return cb(null, file);
    }

    // Don't skip it.
    return null;
}

/**
 * A helper function for the compiler to loop through all destination paths while preserving the async nature of
 * through2 and not using all the computer's memory when converting large images by keeping everything sequential.
 *
 * @param _this
 * @param file
 * @param enc
 * @param cb
 * @param destPaths
 * @param i
 */
function compilerHelper(_this, file, enc, cb, destPaths, i) {

    if(i < destPaths.length) {

        // Spawn a ImageMagic convert process to convert the image for us.
        var sourceExt = util.getFileExtension(file.path),
            destExt = util.getFileExtension(destPaths[i]),
            outputFile;

        // When the input and output extensions are the same and the configuration option for always converting the
        // file is disabled, just clone it instead of compiling it.
        if(!config.convertSameType && sourceExt === destExt) {

            outputFile = file.clone();
            outputFile.base = process.cwd();
            outputFile.path = destPaths[i];

            // Add the file to the pipeline.
            _this.push(outputFile);

            // Compile the next image if any.
            compilerHelper(_this, file, enc, cb, destPaths, i+1);

        } else {

            // TODO: Multiplatform support.
            var proc = spawn(config.executables.convert, [sourceExt + ':-', destExt + ':-']);

            // Pipe the incoming file to the process ...
            proc.stdin.encoding = enc;
            file.pipe(proc.stdin);
            
            // ... and pipe the output to a new vinyl file.
            outputFile = new gutil.File({
                path: destPaths[i],
                contents: proc.stdout
            });

            // Add the file to the pipeline.
            _this.push(outputFile);

            proc.on('exit', function () {
                // Compile the next image if any when ImageMagick is done converting.
                compilerHelper(_this, file, enc, cb, destPaths, i+1);
            });

        }

    } else {
        // When every format is converted, call the through2 callback to signal it that we are done.
        cb();
    }
}

/**
 * Compiles the images to the formats and location specified in the options.
 *
 * @param options
 */
function compiler(options) {
    return through.obj(function(file, enc, cb) {

        // Do some standard checks before proceeding.
        var result = skipCheck(file, cb);
        if(result !== null) {
            return result;
        }

        // Get the paths the images should be converted to.
        var destPaths = util.getDestinationPaths(file, options);

        // Convert the image to all formats.
        compilerHelper(this, file, enc, cb, destPaths, 0);
    });
}

module.exports = {
    compiler: compiler,
    skipCheck: skipCheck
};