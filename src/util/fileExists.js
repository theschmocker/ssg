const { access, constants: fsConstants } = require('./fs-promise');

/**
 * Uses fs.access to determine whether or not a file exists
 * @param  {string} fileName - the filename (or path) to be checked for existence
 * @return {Promise} A promise that resolves to true or false, depending on whether or not the file exists
 */
async function fileExists(fileName) {
    try {
        await access(fileName, fsConstants.F_OK);
        return true;
    } catch (e) {
        return false
    }
}

module.exports = fileExists;