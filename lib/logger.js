var through = require('through2'),
    path = require('path'),
    util = require('./util'),
    compiler = require('./compiler');

module.exports = function pipeLogger(options) {

    // Skip the logger for Elixir < 3.0.0
    if(!options.task.log) {
        return through.obj();
    }

    var sourceFiles = [];
    var destFiles = [];

    return through.obj(
        function(file, enc, cb) {

            // Do some standard checks before proceeding.
            var result = compiler.skipCheck(file, cb);
            if(result !== null) {
                return result;
            }

            // Get the process' base directory the paths should be displayed relatively from.
            var basedir = process.cwd();

            // Store the source path in our list.
            var sourcePath = path.relative(basedir, file.path);
            sourceFiles.push(sourcePath);

            // Get the paths the images should be converted to.
            var destPaths = util.getDestinationPaths(file, options);

            // Store the destination paths in our other list.
            destFiles = destFiles.concat(destPaths);

            // Pipe the file through.
            cb(null, file);
        },
        function(cb) {
            // Log the list.
            options.task.log(sourceFiles, destFiles);

            // Call the callback.
            cb();
        }
    );
}