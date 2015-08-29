var Path = require('path'),
    gutil = require('gulp-util');

/**
 * Replace the given path's base directory to a new one. In a way it moves the imaginary file on that
 * location to a new one relative to the base directories so the directory structure stays intact.
 *
 * @param path
 * @param oldBaseDir
 * @param newBaseDir
 * @returns {string}
 */
function rewriteBaseDir(path, oldBaseDir, newBaseDir) {

    // Remove the directory wildcard glob (somedir/**) at the end of the old base directory.
    oldBaseDir = oldBaseDir.replace(/[\\/]\*\*$/, '');

    // Get the path's relative path from the old base directory.
    var relativePath = Path.relative(oldBaseDir, path);

    // Append the relative path to the new base directory to get the new path.
    return Path.join(newBaseDir, relativePath);

}

/**
 * Replaces the file extension in the given path with the given extension(s).
 *
 * @param path
 * @param newExtensions
 * @returns {Array}
 */
function rewriteFileExtension(path, newExtensions) {

    // If the new extension is a string, make it an array.
    if(typeof newExtensions === 'string') {
        newExtensions = [ newExtensions ];
    }

    // Rewrite the file extension to the new extensions.
    var outputPaths = [];
    for(var i = 0; i < newExtensions.length; i++) {
        outputPaths.push(gutil.replaceExtension(path, '.' + newExtensions[i]));
    }

    return outputPaths;

}

function getDestinationPaths(file, options) {
    // Get the new path as if the whole source directory was moved.
    var destPath = rewriteBaseDir(file.path, options.src.baseDir, options.output.baseDir);

    // Get the paths with the new file extensions.
    var sourceExt = getFileExtension(file.path),
        destPaths;
    if(typeof options.pluginOptions.convert[sourceExt] !== 'undefined') {
        destPaths = rewriteFileExtension(destPath, options.pluginOptions.convert[sourceExt]);
    } else {
        // When no conversion rules are defined, make the compiler just copy the file by
        // preserving the file extension.
        destPaths = [ destPath ];
    }

    return destPaths;
}

/**
 * Does the same as path.extname but without the point. This
 * function returns the file extension of the given path.
 *
 * @param path
 * @returns {string}
 */
function getFileExtension(path) {
    return Path.extname(path).substr(1);
}

module.exports = {
    getDestinationPaths: getDestinationPaths,
    getFileExtension: getFileExtension
};